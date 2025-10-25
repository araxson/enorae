#!/usr/bin/env python3
"""Generate TypeScript types from the remote Supabase project.

This script wraps the Supabase CLI to produce strongly typed database
definitions for the ENORAE codebase. It relies on the credentials stored in
`.env.local` and mirrors the schema exposure defined in `supabase/config.toml`.
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import textwrap
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = PROJECT_ROOT / ".env.local"
CONFIG_FILE = PROJECT_ROOT / "supabase" / "config.toml"
OUTPUT_FILE = PROJECT_ROOT / "lib" / "types" / "database.types.ts"
PROJECT_ID = "nwmcpfioxerzodvbjigw"
REQUIRED_ENV_VARS: Sequence[str] = (
    "SUPABASE_ACCESS_TOKEN",
    "SUPABASE_PROJECT_REF",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Supabase TypeScript types using the Supabase CLI"
    )
    parser.add_argument(
        "--schema",
        dest="schemas",
        action="append",
        default=[],
        help="Additional schema to include (can be provided multiple times)",
    )
    parser.add_argument(
        "--only",
        dest="schema_only",
        action="store_true",
        help="Use only the schemas passed via --schema and ignore config.toml",
    )
    parser.add_argument(
        "--output",
        dest="output",
        type=Path,
        default=OUTPUT_FILE,
        help="Path to write the generated types (default: lib/types/database.types.ts)",
    )
    parser.add_argument(
        "--db-url",
        dest="db_url",
        type=str,
        default=None,
        help="Optional Postgres connection string to use when remote generation fails",
    )
    return parser.parse_args()


class GenerationError(RuntimeError):
    """Custom error raised when type generation fails."""


def load_env_file(path: Path) -> dict[str, str]:
    if not path.exists():
        raise GenerationError(f"Missing environment file: {path}")

    env: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip()
    return env


def ensure_required_env(env: dict[str, str]) -> None:
    missing = [var for var in REQUIRED_ENV_VARS if not env.get(var)]
    if missing:
        message = ", ".join(missing)
        raise GenerationError(
            "Missing required environment variables in .env.local: " + message
        )

    for key, value in env.items():
        os.environ.setdefault(key, value)


def read_schemas(config_path: Path) -> List[str]:
    if not config_path.exists():
        raise GenerationError(f"Missing Supabase config: {config_path}")

    text = config_path.read_text(encoding="utf-8")
    match = re.search(r"^schemas\s*=\s*\[(.*?)\]", text, flags=re.MULTILINE | re.DOTALL)
    schemas: List[str]
    if match:
        schemas = re.findall(r"\"([^\"]+)\"", match.group(1))
    else:
        schemas = []

    return schemas


def resolve_cli_command() -> Sequence[str]:
    executable = shutil.which("supabase")
    if executable:
        return [executable]

    npx = shutil.which("npx")
    if npx:
        return [npx, "--yes", "supabase"]

    raise GenerationError(
        "Supabase CLI not found. Install it with `npm install -g supabase`."
    )


def merge_schemas(*schema_iterables: Iterable[str]) -> List[str]:
    result: List[str] = []
    for iterable in schema_iterables:
        for schema in iterable:
            if not schema:
                continue
            if schema not in result:
                result.append(schema)
    if "public" not in result:
        result.insert(0, "public")
    return result


def run_supabase_gen(
    cli_cmd: Sequence[str],
    schemas: Iterable[str],
    *,
    project_ref: Optional[str] = None,
    db_url: Optional[str] = None,
) -> str:
    if not project_ref and not db_url:
        raise ValueError("Either project_ref or db_url must be provided")

    command: List[str] = list(cli_cmd) + ["gen", "types", "typescript"]

    if project_ref:
        command.extend(["--project-id", project_ref])
    if db_url:
        command.extend(["--db-url", db_url])

    for schema in schemas:
        command.extend(["--schema", schema])

    env = os.environ.copy()
    env.setdefault("SUPABASE_ACCESS_TOKEN", "")

    result = subprocess.run(
        command,
        cwd=str(PROJECT_ROOT),
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        stderr = result.stderr.strip() or "Unknown error"
        raise GenerationError(f"Supabase CLI failed ({result.returncode}): {stderr}")

    output = result.stdout.strip()
    if not output:
        raise GenerationError("Supabase CLI returned no output")

    return output


def map_postgres_type(
    schema: str,
    type_name: str,
    data_type: str,
    enums_by_schema: Dict[str, Dict[str, List[str]]],
) -> str:
    base_type = type_name.lstrip('_') if type_name else ''
    is_array = type_name.startswith('_') or data_type.endswith('[]')

    enum_schema = enums_by_schema.get(schema, {})
    if base_type in enum_schema:
        ts_type = f"Database[{schema!r}]['Enums'][{base_type!r}]"
    else:
        normalized = base_type.lower()
        if normalized in {'bool', 'boolean'}:
            ts_type = 'boolean'
        elif normalized in {'int2', 'int4', 'int8', 'smallint', 'integer', 'bigint', 'float4', 'float8', 'numeric', 'real', 'double precision'}:
            ts_type = 'number'
        elif normalized in {
            'money',
            'bytea',
            'bpchar',
            'varchar',
            'date',
            'text',
            'citext',
            'time',
            'timetz',
            'timestamp',
            'timestamptz',
            'uuid',
            'vector',
            'inet',
            'cidr',
            'macaddr',
            'macaddr8',
            'tsvector',
            'interval',
            'name',
            'ltree',
        }:
            ts_type = 'string'
        elif normalized in {'json', 'jsonb'}:
            ts_type = 'Json'
        elif normalized == 'void':
            ts_type = 'void'
        elif normalized == 'record':
            ts_type = 'Record<string, unknown>'
        else:
            ts_type = 'unknown'

    if is_array and ts_type != 'unknown':
        return f"{ts_type}[]"
    if is_array and ts_type == 'unknown':
        return 'unknown[]'
    return ts_type


def format_with_prettier(content: str) -> str:
    try:
        process = subprocess.run(
            [
                "npx",
                "--yes",
                "prettier@3.3.3",
                "--parser",
                "typescript",
            ],
            input=content,
            text=True,
            capture_output=True,
            check=True,
        )
        return process.stdout
    except Exception:
        return content


def generate_types_with_psycopg(db_url: str, schemas: List[str]) -> str:
    try:
        import psycopg
        from psycopg.rows import dict_row
    except ImportError as exc:
        raise GenerationError(
            "psycopg is required for fallback generation. Install it with 'pip install psycopg[binary]'."
        ) from exc

    schemas = sorted(set(schemas))
    schema_clause = ",".join(f"'{s}'" for s in schemas)

    try:
        with psycopg.connect(db_url, autocommit=True) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    f"""
                SELECT c.oid::bigint AS id,
                       n.nspname AS schema,
                       c.relname AS name,
                       c.relkind,
                       obj_description(c.oid) AS comment
                FROM pg_class c
                JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE n.nspname IN ({schema_clause})
                  AND c.relkind IN ('r', 'p')
                ORDER BY n.nspname, c.relname;
                    """
                )
                tables = cur.fetchall()

                cur.execute(
                    f"""
                SELECT c.oid::bigint AS id,
                       n.nspname AS schema,
                       c.relname AS name,
                       c.relkind,
                       obj_description(c.oid) AS comment
                FROM pg_class c
                JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE n.nspname IN ({schema_clause})
                  AND c.relkind IN ('v', 'm', 'f')
                ORDER BY n.nspname, c.relname;
                    """
                )
                views = cur.fetchall()

                cur.execute(
                    f"""
                SELECT
                  c.oid::bigint AS table_id,
                  n.nspname AS schema,
                  c.relname AS table,
                  a.attnum AS ordinal_position,
                  a.attname AS name,
                  format_type(a.atttypid, a.atttypmod) AS data_type,
                  COALESCE(bt.typname, t.typname) AS type_name,
                  a.atthasdef AS has_default,
                  CASE WHEN a.atthasdef THEN pg_get_expr(ad.adbin, ad.adrelid) END AS default_value,
                  a.attidentity IN ('a','d') AS is_identity,
                  CASE a.attidentity WHEN 'a' THEN 'ALWAYS' WHEN 'd' THEN 'BY DEFAULT' ELSE NULL END AS identity_generation,
                  a.attgenerated = 's' AS is_generated,
                  NOT a.attnotnull AS is_nullable
                FROM pg_attribute a
                LEFT JOIN pg_attrdef ad ON a.attrelid = ad.adrelid AND a.attnum = ad.adnum
                JOIN pg_class c ON c.oid = a.attrelid
                JOIN pg_namespace n ON n.oid = c.relnamespace
                JOIN pg_type t ON t.oid = a.atttypid
                LEFT JOIN pg_type bt ON t.typtype = 'd' AND t.typbasetype = bt.oid
                WHERE n.nspname IN ({schema_clause})
                  AND c.relkind IN ('r','p','v','m','f')
                  AND a.attnum > 0
                  AND NOT a.attisdropped
                ORDER BY c.oid, a.attnum;
                    """
                )
                columns = cur.fetchall()

                cur.execute(
                    f"""
                SELECT
                  tc.constraint_schema AS schema,
                  tc.table_name AS table_name,
                  tc.constraint_name,
                  array_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS columns,
                  ccu.table_schema AS referenced_schema,
                  ccu.table_name AS referenced_table,
                  array_agg(ccu.column_name ORDER BY kcu.ordinal_position) AS referenced_columns
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                  ON tc.constraint_name = kcu.constraint_name
                 AND tc.constraint_schema = kcu.constraint_schema
                JOIN information_schema.constraint_column_usage ccu
                  ON ccu.constraint_name = tc.constraint_name
                 AND ccu.constraint_schema = tc.constraint_schema
                WHERE tc.constraint_type = 'FOREIGN KEY'
                  AND tc.constraint_schema IN ({schema_clause})
                GROUP BY tc.constraint_schema, tc.table_name, tc.constraint_name, ccu.table_schema, ccu.table_name
                ORDER BY tc.constraint_schema, tc.table_name;
                    """
                )
                relationships = cur.fetchall()

                cur.execute(
                    f"""
                SELECT
                  t.oid::bigint AS id,
                  n.nspname AS schema,
                  t.typname AS name,
                  array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels
                FROM pg_type t
                JOIN pg_enum e ON e.enumtypid = t.oid
                JOIN pg_namespace n ON n.oid = t.typnamespace
                WHERE n.nspname IN ({schema_clause})
                GROUP BY t.oid, n.nspname, t.typname
                ORDER BY n.nspname, t.typname;
                    """
                )
                enums = cur.fetchall()
    except psycopg.Error as exc:
        raise GenerationError(f"Failed to inspect database schema: {exc}") from exc

    columns_by_table: Dict[int, List[Dict[str, object]]] = {}
    for column in columns:
        columns_by_table.setdefault(column['table_id'], []).append(column)

    relationships_by_table: Dict[tuple[str, str], List[Dict[str, object]]] = {}
    for rel in relationships:
        key = (rel['schema'], rel['table_name'])
        relationships_by_table.setdefault(key, []).append(rel)

    enums_by_schema: Dict[str, Dict[str, List[str]]] = {}
    for enum in enums:
        enums_by_schema.setdefault(enum['schema'], {})[enum['name']] = enum['labels'] or []

    tables_by_schema: Dict[str, List[Dict[str, object]]] = {schema: [] for schema in schemas}
    for table in tables:
        tables_by_schema.setdefault(table['schema'], []).append(table)

    views_by_schema: Dict[str, List[Dict[str, object]]] = {schema: [] for schema in schemas}
    for view in views:
        views_by_schema.setdefault(view['schema'], []).append(view)

    for schema in schemas:
        tables_by_schema.setdefault(schema, [])
        views_by_schema.setdefault(schema, [])
        enums_by_schema.setdefault(schema, {})

    def column_row_type(column: Dict[str, object], schema: str) -> str:
        base = map_postgres_type(
            schema,
            (column['type_name'] or '') if column['type_name'] else '',
            column['data_type'] or '',
            enums_by_schema,
        )
        if column.get('is_nullable'):
            return f"{base} | null"
        return base

    def column_insert_optional(column: Dict[str, object]) -> bool:
        return bool(
            column.get('is_nullable')
            or column.get('has_default')
            or column.get('is_identity')
            or column.get('is_generated')
        )

    def relationship_lines(schema: str, table_name: str) -> List[str]:
        rels = relationships_by_table.get((schema, table_name), [])
        if not rels:
            return ["Relationships: []"]
        lines: List[str] = ["Relationships: ["]
        for rel in rels:
            lines.append("  {")
            lines.append(f"    foreignKeyName: {rel['constraint_name']!r}")
            lines.append(f"    columns: {rel['columns']}")
            lines.append(f"    referencedRelation: {rel['referenced_table']!r}")
            lines.append(f"    referencedColumns: {rel['referenced_columns']}")
            lines.append("  }")
        lines.append("]")
        return lines

    content_lines: List[str] = []

    content_lines.append(
        textwrap.dedent(
            """
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
"""
        ).strip()
    )

    content_lines.append("export type Database = {")
    for schema in schemas:
        content_lines.append(f"  {schema}: {{")

        # Tables
        content_lines.append("    Tables: {")
        schema_tables = tables_by_schema.get(schema, [])
        if schema_tables:
            for table in schema_tables:
                table_name = table['name']
                table_columns = columns_by_table.get(table['id'], [])
                content_lines.append(f"      {table_name!r}: {{")

                # Row type
                if table_columns:
                    content_lines.append("        Row: {")
                    for column in table_columns:
                        ts_type = column_row_type(column, schema)
                        content_lines.append(
                            f"          {column['name']!r}: {ts_type}"  # type ok
                        )
                    content_lines.append("        }")
                else:
                    content_lines.append("        Row: Record<string, never>")

                # Insert type
                content_lines.append("        Insert: {")
                if table_columns:
                    for column in table_columns:
                        optional = column_insert_optional(column)
                        ts_type = column_row_type(column, schema)
                        suffix = '?' if optional else ''
                        content_lines.append(
                            f"          {column['name']!r}{suffix}: {ts_type}"
                        )
                content_lines.append("        }")

                # Update type
                content_lines.append("        Update: {")
                if table_columns:
                    for column in table_columns:
                        ts_type = column_row_type(column, schema)
                        content_lines.append(
                            f"          {column['name']!r}?: {ts_type}"
                        )
                content_lines.append("        }")

                rel_lines = relationship_lines(schema, table_name)
                for rel_line in rel_lines:
                    content_lines.append(f"        {rel_line}")

                content_lines.append("      }")
        else:
            content_lines.append("      [key: string]: never")
        content_lines.append("    }")

        # Views
        content_lines.append("    Views: {")
        schema_views = views_by_schema.get(schema, [])
        if schema_views:
            for view in schema_views:
                view_name = view['name']
                view_columns = columns_by_table.get(view['id'], [])
                content_lines.append(f"      {view_name!r}: {{")
                if view_columns:
                    content_lines.append("        Row: {")
                    for column in view_columns:
                        ts_type = column_row_type(column, schema)
                        content_lines.append(
                            f"          {column['name']!r}: {ts_type}"
                        )
                    content_lines.append("        }")
                else:
                    content_lines.append("        Row: Record<string, never>")
                content_lines.append("        Insert: never")
                content_lines.append("        Update: never")
                content_lines.append("        Relationships: []")
                content_lines.append("      }")
        else:
            content_lines.append("      [key: string]: never")
        content_lines.append("    }")

        # Functions placeholder
        content_lines.append("    Functions: {")
        content_lines.append("      [key: string]: never")
        content_lines.append("    }")

        # Enums
        content_lines.append("    Enums: {")
        schema_enums = enums_by_schema.get(schema, {})
        if schema_enums:
            for enum_name, labels in schema_enums.items():
                if labels:
                    union = " | ".join(repr(label) for label in labels)
                else:
                    union = 'string'
                content_lines.append(f"      {enum_name!r}: {union}")
        else:
            content_lines.append("      [key: string]: never")
        content_lines.append("    }")

        content_lines.append("    CompositeTypes: {")
        content_lines.append("      [key: string]: never")
        content_lines.append("    }")

        content_lines.append("  }")
    content_lines.append("}")

    content_lines.append(
        textwrap.dedent(
            """
export type Tables<
  Schema extends keyof Database = keyof Database,
  TableName extends keyof Database[Schema]['Tables'] = keyof Database[Schema]['Tables']
> = Database[Schema]['Tables'][TableName]['Row']

export type TablesInsert<
  Schema extends keyof Database = keyof Database,
  TableName extends keyof Database[Schema]['Tables'] = keyof Database[Schema]['Tables']
> = Database[Schema]['Tables'][TableName]['Insert']

export type TablesUpdate<
  Schema extends keyof Database = keyof Database,
  TableName extends keyof Database[Schema]['Tables'] = keyof Database[Schema]['Tables']
> = Database[Schema]['Tables'][TableName]['Update']

export type Views<
  Schema extends keyof Database = keyof Database,
  ViewName extends keyof Database[Schema]['Views'] = keyof Database[Schema]['Views']
> = Database[Schema]['Views'][ViewName]['Row']

export type Enums<
  Schema extends keyof Database = keyof Database,
  EnumName extends keyof Database[Schema]['Enums'] = keyof Database[Schema]['Enums']
> = Database[Schema]['Enums'][EnumName]

export type CompositeTypes<
  Schema extends keyof Database = keyof Database,
  TypeName extends keyof Database[Schema]['CompositeTypes'] = keyof Database[Schema]['CompositeTypes']
> = Database[Schema]['CompositeTypes'][TypeName]
"""
        ).strip()
    )

    raw_content = "\n".join(content_lines) + "\n"
    return format_with_prettier(raw_content)
def write_types(content: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)

    header = (
        "/**\n"
        " * Supabase Database Types\n"
        " * Generated on {timestamp}\n"
        " * DO NOT EDIT THIS FILE MANUALLY.\n"
        " */\n\n"
    ).format(timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%SZ"))

    destination.write_text(header + content + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    try:
        env = load_env_file(ENV_FILE)
        ensure_required_env(env)

        config_schemas = [] if args.schema_only else read_schemas(CONFIG_FILE)
        schemas = merge_schemas(["public"], config_schemas, args.schemas)
        cli_command = resolve_cli_command()

        print("Generating Supabase types...")
        print(f"  Project ref: {env['SUPABASE_PROJECT_REF']}")
        print(f"  Schemas: {', '.join(schemas)}")

        print("  Mode: remote project")
        try:
            content = run_supabase_gen(
                cli_command,
                schemas,
                project_ref=env["SUPABASE_PROJECT_REF"],
            )
        except GenerationError as exc:
            fallback_url = (
                args.db_url
                or env.get("TYPEGEN_DB_URL")
                or env.get("DIRECT_DATABASE_URL")
                or env.get("DATABASE_URL")
            )
            if fallback_url:
                print(
                    "  Remote project generation failed. "
                    "Falling back to direct connection." 
                )
                print("  Mode: direct connection")
                try:
                    content = run_supabase_gen(
                        cli_command,
                        schemas,
                        db_url=fallback_url,
                    )
                except GenerationError as direct_exc:
                    print(
                        "  Direct CLI generation failed. Using psycopg fallback."
                    )
                    content = generate_types_with_psycopg(fallback_url, list(schemas))
            else:
                raise

        write_types(content, args.output)

        try:
            relative_output = (
                args.output.relative_to(PROJECT_ROOT)
                if args.output.is_relative_to(PROJECT_ROOT)
                else args.output
            )
            print(f"Types written to {relative_output}")
        except ValueError:
            print("Types written to", args.output)
        return 0
    except GenerationError as exc:
        print(f"Error: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
