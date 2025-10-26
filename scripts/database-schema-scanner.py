#!/usr/bin/env python3
"""
Database Schema Scanner & Mismatch Detector

This script:
1. Parses the Supabase database schema from lib/types/database.types.ts
2. Scans all TypeScript/TSX files for database access patterns
3. Validates that code matches the actual database schema
4. Reports all mismatches with details
5. Saves results to JSON for analysis and fixing

Database is the single source of truth.
Frontend code must match the database, not the other way around.
"""

import json
import re
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple
from dataclasses import dataclass, asdict
from collections import defaultdict
import ast

@dataclass
class DatabaseTable:
    """Represents a database table or view"""
    schema: str
    name: str
    type: str  # 'table' or 'view'
    columns: Dict[str, str]  # column_name -> column_type

@dataclass
class RPCFunction:
    """Represents a database RPC function"""
    schema: str
    name: str
    args: List[str]

@dataclass
class CodeMatch:
    """Represents a database access in code"""
    file: str
    line: int
    type: str  # 'from', 'rpc', 'schema', 'property_access'
    table_or_function: str
    schema_name: Optional[str]
    property_name: Optional[str]
    context: str

@dataclass
class Mismatch:
    """Represents a schema/code mismatch"""
    type: str  # 'table_not_found', 'view_not_found', 'property_not_found', etc.
    severity: str  # 'critical', 'high', 'medium', 'low'
    file: str
    line: int
    code_element: str
    issue: str
    suggestion: str
    context: str

class DatabaseSchemaParser:
    """Parses database schema from lib/types/database.types.ts"""

    def __init__(self, database_types_path: str):
        self.path = database_types_path
        self.tables: Dict[str, Dict[str, DatabaseTable]] = defaultdict(dict)  # schema -> name -> table
        self.views: Dict[str, Dict[str, DatabaseTable]] = defaultdict(dict)   # schema -> name -> view
        self.functions: Dict[str, Dict[str, RPCFunction]] = defaultdict(dict)  # schema -> name -> function
        self.schemas: Set[str] = set()

    def parse(self) -> None:
        """Parse the database.types.ts file"""
        if not os.path.exists(self.path):
            raise FileNotFoundError(f"Database types file not found: {self.path}")

        with open(self.path, 'r') as f:
            content = f.read()

        # Extract schema names
        self._extract_schemas(content)

        # Extract tables from each schema
        self._extract_tables(content)

        # Extract views from each schema
        self._extract_views(content)

        # Extract RPC functions
        self._extract_functions(content)

    def _extract_schemas(self, content: str) -> None:
        """Extract schema names from Database type definition"""
        # Look for schema: { Tables: { ... } pattern
        # A real schema has Tables, Views, Functions, etc.
        schema_pattern = r"^\s+([a-z_]+):\s*{\s*$"

        lines = content.split('\n')
        for i, line in enumerate(lines):
            match = re.match(schema_pattern, line)
            if match:
                schema_name = match.group(1)
                # Filter out system/type properties
                if schema_name not in ['__InternalSupabase', 'Relationships']:
                    # Check if this is followed by Tables, Views, or Functions
                    # Look ahead a few lines
                    next_lines = '\n'.join(lines[i:min(i+10, len(lines))])
                    if 'Tables:' in next_lines or 'Views:' in next_lines or 'Functions:' in next_lines:
                        self.schemas.add(schema_name)

    def _extract_tables(self, content: str) -> None:
        """Extract table definitions"""
        # For each schema, find its Tables section
        for schema in self.schemas:
            # Find the schema section
            schema_start = content.find(f"{schema}: {{")
            if schema_start == -1:
                continue

            # Find Tables: { within this schema
            tables_start = content.find("Tables: {", schema_start)
            if tables_start == -1:
                continue

            # Find the end of Tables section (next Views: or Functions:)
            tables_end = min(
                (content.find("Views: {", tables_start) if "Views: {" in content[tables_start:tables_start+50000] else len(content)),
                (content.find("Functions: {", tables_start) if "Functions: {" in content[tables_start:tables_start+50000] else len(content))
            )

            tables_content = content[tables_start:tables_end]

            # Extract each table: pattern is "table_name: { Row: { ... } }"
            table_pattern = r"(\w+):\s*{\s*Row:\s*{([^}]*?)}\s*Insert:"

            for match in re.finditer(table_pattern, tables_content, re.DOTALL):
                table_name = match.group(1)
                columns_str = match.group(2)
                columns = self._extract_columns(columns_str)

                if columns:  # Only add if we found columns
                    self.tables[schema][table_name] = DatabaseTable(
                        schema=schema,
                        name=table_name,
                        type='table',
                        columns=columns
                    )

    def _extract_views(self, content: str) -> None:
        """Extract view definitions"""
        # For each schema, find its Views section
        for schema in self.schemas:
            # Find the schema section
            schema_start = content.find(f"{schema}: {{")
            if schema_start == -1:
                continue

            # Find Views: { within this schema
            views_start = content.find("Views: {", schema_start)
            if views_start == -1:
                continue

            # Find the end of Views section (next Functions:)
            views_end = content.find("Functions: {", views_start)
            if views_end == -1:
                views_end = len(content)

            views_content = content[views_start:views_end]

            # Extract each view: pattern is "view_name: { Row: { ... } }"
            view_pattern = r"(\w+):\s*{\s*Row:\s*{([^}]*?)}\s*Insert:"

            for match in re.finditer(view_pattern, views_content, re.DOTALL):
                view_name = match.group(1)
                columns_str = match.group(2)
                columns = self._extract_columns(columns_str)

                if columns:  # Only add if we found columns
                    self.views[schema][view_name] = DatabaseTable(
                        schema=schema,
                        name=view_name,
                        type='view',
                        columns=columns
                    )

    def _extract_functions(self, content: str) -> None:
        """Extract RPC function definitions"""
        # For each schema, find its Functions section
        for schema in self.schemas:
            # Find the schema section
            schema_start = content.find(f"{schema}: {{")
            if schema_start == -1:
                continue

            # Find Functions: { within this schema
            functions_start = content.find("Functions: {", schema_start)
            if functions_start == -1:
                continue

            # Find the end of Functions section (next Enums: or closing brace)
            functions_end = content.find("Enums: {", functions_start)
            if functions_end == -1:
                functions_end = len(content)

            functions_content = content[functions_start:functions_end]

            # Extract each function: pattern is "func_name: { Args: { ... } }"
            func_pattern = r"(\w+):\s*{\s*Args:\s*{([^}]*?)}\s*Returns:"

            for match in re.finditer(func_pattern, functions_content, re.DOTALL):
                func_name = match.group(1)
                args_str = match.group(2)
                # Extract argument names
                args = re.findall(r"(\w+):", args_str)

                if func_name not in ['Relationships']:
                    self.functions[schema][func_name] = RPCFunction(
                        schema=schema,
                        name=func_name,
                        args=args
                    )

    def _extract_columns(self, columns_str: str) -> Dict[str, str]:
        """Extract column names and types from a columns definition"""
        columns = {}
        if not columns_str.strip():
            return columns

        # Pattern to match: column_name: type (can be complex with | and null)
        # Match until we hit end of line
        pattern = r"(\w+):\s*([^,\n}]+?)(?=\n|\})"

        for match in re.finditer(pattern, columns_str):
            col_name = match.group(1).strip()
            col_type = match.group(2).strip()

            # Skip empty columns
            if col_name and col_type:
                columns[col_name] = col_type

        return columns

    def get_table(self, schema: str, table_name: str) -> Optional[DatabaseTable]:
        """Get a table definition"""
        # Try with explicit schema first
        if schema in self.tables and table_name in self.tables[schema]:
            return self.tables[schema][table_name]

        # Try public schema if not found
        if 'public' in self.tables and table_name in self.tables['public']:
            return self.tables['public'][table_name]

        return None

    def get_view(self, schema: str, view_name: str) -> Optional[DatabaseTable]:
        """Get a view definition"""
        # Try with explicit schema first
        if schema in self.views and view_name in self.views[schema]:
            return self.views[schema][view_name]

        # Try public schema if not found
        if 'public' in self.views and view_name in self.views['public']:
            return self.views['public'][view_name]

        return None

    def table_exists(self, schema: str, table_name: str) -> bool:
        """Check if a table exists"""
        return (schema in self.tables and table_name in self.tables[schema]) or \
               ('public' in self.tables and table_name in self.tables['public'])

    def view_exists(self, schema: str, view_name: str) -> bool:
        """Check if a view exists"""
        return (schema in self.views and view_name in self.views[schema]) or \
               ('public' in self.views and view_name in self.views['public'])

    def function_exists(self, schema: str, func_name: str) -> bool:
        """Check if an RPC function exists"""
        return (schema in self.functions and func_name in self.functions[schema]) or \
               ('public' in self.functions and func_name in self.functions['public'])


class CodeScanner:
    """Scans TypeScript/TSX files for database access patterns"""

    def __init__(self, root_path: str):
        self.root_path = root_path
        self.matches: List[CodeMatch] = []

    def scan(self) -> List[CodeMatch]:
        """Scan all TypeScript/TSX files for database access"""
        for file_path in self._find_ts_files():
            self._scan_file(file_path)
        return self.matches

    def _find_ts_files(self) -> List[str]:
        """Find all TypeScript/TSX files"""
        ts_files = []
        for root, dirs, files in os.walk(self.root_path):
            # Skip node_modules and .next
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', '.git', 'dist']]

            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    ts_files.append(os.path.join(root, file))
        return ts_files

    def _scan_file(self, file_path: str) -> None:
        """Scan a single TypeScript file for database access patterns"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')

            # Scan for .from() calls
            self._scan_from_calls(file_path, content, lines)

            # Scan for .rpc() calls
            self._scan_rpc_calls(file_path, content, lines)

            # Scan for .schema() calls
            self._scan_schema_calls(file_path, content, lines)

            # Scan for property access on database rows
            self._scan_property_access(file_path, content, lines)

        except Exception as e:
            print(f"Warning: Error scanning {file_path}: {e}", file=sys.stderr)

    def _scan_from_calls(self, file_path: str, content: str, lines: List[str]) -> None:
        """Scan for .from('table_name') calls"""
        pattern = r"\.from\s*\(\s*['\"]([a-z_]+)['\"]\s*\)"

        for match in re.finditer(pattern, content):
            table_name = match.group(1)
            line_num = content[:match.start()].count('\n') + 1
            context = lines[line_num - 1].strip() if line_num <= len(lines) else ""

            # Check for preceding .schema() call
            schema = 'public'
            schema_pattern = r"\.schema\s*\(\s*['\"]([a-z_]+)['\"]\s*\)\s*\.from\s*\(\s*['\"]" + re.escape(table_name)
            if re.search(schema_pattern, content[:match.start()]):
                schema_match = re.search(r"\.schema\s*\(\s*['\"]([a-z_]+)['\"]", content[:match.start()][-100:])
                if schema_match:
                    schema = schema_match.group(1)

            self.matches.append(CodeMatch(
                file=file_path.replace(self.root_path, ''),
                line=line_num,
                type='from',
                table_or_function=table_name,
                schema_name=schema,
                property_name=None,
                context=context
            ))

    def _scan_rpc_calls(self, file_path: str, content: str, lines: List[str]) -> None:
        """Scan for .rpc('function_name') calls"""
        pattern = r"\.rpc\s*\(\s*['\"]([a-z_]+)['\"]\s*"

        for match in re.finditer(pattern, content):
            func_name = match.group(1)
            line_num = content[:match.start()].count('\n') + 1
            context = lines[line_num - 1].strip() if line_num <= len(lines) else ""

            self.matches.append(CodeMatch(
                file=file_path.replace(self.root_path, ''),
                line=line_num,
                type='rpc',
                table_or_function=func_name,
                schema_name='public',
                property_name=None,
                context=context
            ))

    def _scan_schema_calls(self, file_path: str, content: str, lines: List[str]) -> None:
        """Scan for .schema('schema_name') calls"""
        pattern = r"\.schema\s*\(\s*['\"]([a-z_]+)['\"]\s*\)"

        for match in re.finditer(pattern, content):
            schema_name = match.group(1)
            line_num = content[:match.start()].count('\n') + 1
            context = lines[line_num - 1].strip() if line_num <= len(lines) else ""

            self.matches.append(CodeMatch(
                file=file_path.replace(self.root_path, ''),
                line=line_num,
                type='schema',
                table_or_function=None,
                schema_name=schema_name,
                property_name=None,
                context=context
            ))

    def _scan_property_access(self, file_path: str, content: str, lines: List[str]) -> None:
        """Scan for property access on database rows (simplified)"""
        # Look for row.property_name patterns
        # This is simplified - full analysis would require AST parsing
        pattern = r"row\.([a-z_]+)|data\.([a-z_]+)|result\.([a-z_]+)"

        for match in re.finditer(pattern, content):
            prop_name = match.group(1) or match.group(2) or match.group(3)
            if prop_name and not prop_name.startswith('_'):  # Ignore internal props
                line_num = content[:match.start()].count('\n') + 1
                context = lines[line_num - 1].strip() if line_num <= len(lines) else ""

                self.matches.append(CodeMatch(
                    file=file_path.replace(self.root_path, ''),
                    line=line_num,
                    type='property_access',
                    table_or_function=None,
                    schema_name=None,
                    property_name=prop_name,
                    context=context
                ))


class MismatchDetector:
    """Detects mismatches between code and database schema"""

    def __init__(self, db_parser: DatabaseSchemaParser, code_matches: List[CodeMatch]):
        self.db_parser = db_parser
        self.code_matches = code_matches
        self.mismatches: List[Mismatch] = []

    def detect(self) -> List[Mismatch]:
        """Detect all mismatches"""
        for match in self.code_matches:
            if match.type == 'from':
                self._check_table_or_view(match)
            elif match.type == 'rpc':
                self._check_rpc_function(match)
            elif match.type == 'schema':
                self._check_schema(match)
            elif match.type == 'property_access':
                self._check_property(match)

        return self.mismatches

    def _check_table_or_view(self, match: CodeMatch) -> None:
        """Check if a table or view exists"""
        schema = match.schema_name or 'public'
        name = match.table_or_function

        # Check if it's a view first (views often have _view suffix)
        if self.db_parser.view_exists(schema, name):
            return

        # Then check if it's a table
        if self.db_parser.table_exists(schema, name):
            return

        # Not found - determine what to suggest
        view_name = f"{name}_view"
        if self.db_parser.view_exists('public', view_name):
            suggestion = f"Use '.from('{view_name}')' instead - it exists in public schema"
        elif self.db_parser.view_exists(schema, view_name):
            suggestion = f"Use '.schema('{schema}').from('{view_name}')' - add _view suffix"
        else:
            suggestion = f"Table/view '{name}' not found in schema '{schema}'. Check database schema."

        self.mismatches.append(Mismatch(
            type='table_not_found',
            severity='critical',
            file=match.file,
            line=match.line,
            code_element=name,
            issue=f"Table or view '{name}' not found in schema '{schema}'",
            suggestion=suggestion,
            context=match.context
        ))

    def _check_rpc_function(self, match: CodeMatch) -> None:
        """Check if an RPC function exists"""
        schema = 'public'
        name = match.table_or_function

        if self.db_parser.function_exists(schema, name):
            return

        self.mismatches.append(Mismatch(
            type='rpc_not_found',
            severity='critical',
            file=match.file,
            line=match.line,
            code_element=name,
            issue=f"RPC function '{name}' not found in database",
            suggestion=f"Check database schema for available RPC functions or implement {name}",
            context=match.context
        ))

    def _check_schema(self, match: CodeMatch) -> None:
        """Check if a schema exists"""
        schema = match.schema_name

        if schema not in self.db_parser.schemas:
            self.mismatches.append(Mismatch(
                type='schema_not_found',
                severity='critical',
                file=match.file,
                line=match.line,
                code_element=schema,
                issue=f"Schema '{schema}' not found in database",
                suggestion=f"Use one of these schemas: {', '.join(sorted(self.db_parser.schemas))}",
                context=match.context
            ))

    def _check_property(self, match: CodeMatch) -> None:
        """Check if a property exists on database rows"""
        # This is simplified - would need to track context to know which table
        # For now, just flag unusual property names
        prop = match.property_name

        # Common false positives
        if prop in ['length', 'map', 'filter', 'reduce', 'forEach', 'find', 'some', 'every']:
            return

        # SQL-like properties that might not exist
        if '_' in prop and not any(
            col in prop for schema_tables in self.db_parser.tables.values()
            for table in schema_tables.values()
            for col in table.columns
        ):
            # Might be a computed property or joined data - low severity
            self.mismatches.append(Mismatch(
                type='property_possibly_not_found',
                severity='low',
                file=match.file,
                line=match.line,
                code_element=prop,
                issue=f"Property '{prop}' might not exist on database row",
                suggestion=f"Verify '{prop}' is returned by your query or computed in code",
                context=match.context
            ))


class ScannerReporter:
    """Generates reports from scan results"""

    @staticmethod
    def generate_json_report(
        db_parser: DatabaseSchemaParser,
        code_matches: List[CodeMatch],
        mismatches: List[Mismatch],
        output_path: str
    ) -> None:
        """Generate a comprehensive JSON report"""

        report = {
            'metadata': {
                'title': 'Database Schema vs Frontend Code Mismatch Report',
                'description': 'Scan of TypeScript/TSX code against Supabase database schema',
                'generated_at': __import__('datetime').datetime.now().isoformat(),
                'source_of_truth': 'database (database.types.ts)',
                'expectation': 'Frontend code must match database, not vice versa'
            },
            'database_summary': {
                'total_schemas': len(db_parser.schemas),
                'total_tables': sum(len(tables) for tables in db_parser.tables.values()),
                'total_views': sum(len(views) for views in db_parser.views.values()),
                'total_functions': sum(len(funcs) for funcs in db_parser.functions.values()),
                'schemas': sorted(list(db_parser.schemas))
            },
            'code_scan_summary': {
                'total_from_calls': sum(1 for m in code_matches if m.type == 'from'),
                'total_rpc_calls': sum(1 for m in code_matches if m.type == 'rpc'),
                'total_schema_calls': sum(1 for m in code_matches if m.type == 'schema'),
                'total_property_accesses': sum(1 for m in code_matches if m.type == 'property_access'),
                'total_matches': len(code_matches)
            },
            'mismatch_summary': {
                'total_mismatches': len(mismatches),
                'critical': sum(1 for m in mismatches if m.severity == 'critical'),
                'high': sum(1 for m in mismatches if m.severity == 'high'),
                'medium': sum(1 for m in mismatches if m.severity == 'medium'),
                'low': sum(1 for m in mismatches if m.severity == 'low'),
            },
            'mismatches_by_type': {},
            'mismatches_by_file': {},
            'critical_mismatches': [],
            'all_mismatches': []
        }

        # Organize by type
        for mismatch in mismatches:
            mtype = mismatch.type
            if mtype not in report['mismatches_by_type']:
                report['mismatches_by_type'][mtype] = []
            report['mismatches_by_type'][mtype].append(asdict(mismatch))

        # Organize by file
        for mismatch in mismatches:
            file = mismatch.file
            if file not in report['mismatches_by_file']:
                report['mismatches_by_file'][file] = []
            report['mismatches_by_file'][file].append(asdict(mismatch))

        # Extract critical mismatches
        report['critical_mismatches'] = [
            asdict(m) for m in mismatches if m.severity == 'critical'
        ]

        # All mismatches
        report['all_mismatches'] = [asdict(m) for m in mismatches]

        # Write report
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"✅ Report generated: {output_path}")
        print(f"   Total mismatches: {len(mismatches)}")
        print(f"   Critical: {report['mismatch_summary']['critical']}")
        print(f"   High: {report['mismatch_summary']['high']}")
        print(f"   Medium: {report['mismatch_summary']['medium']}")
        print(f"   Low: {report['mismatch_summary']['low']}")

    @staticmethod
    def print_summary(mismatches: List[Mismatch]) -> None:
        """Print a summary to console"""
        print("\n" + "="*80)
        print("DATABASE SCHEMA VS FRONTEND CODE MISMATCH REPORT")
        print("="*80)
        print(f"\nTotal Mismatches: {len(mismatches)}\n")

        by_severity = defaultdict(list)
        for m in mismatches:
            by_severity[m.severity].append(m)

        for severity in ['critical', 'high', 'medium', 'low']:
            if severity in by_severity:
                print(f"\n{severity.upper()} ({len(by_severity[severity])}):")
                for m in by_severity[severity][:5]:  # Show first 5
                    print(f"  {m.file}:{m.line}")
                    print(f"    Issue: {m.issue}")
                    print(f"    Suggestion: {m.suggestion}")
                if len(by_severity[severity]) > 5:
                    print(f"  ... and {len(by_severity[severity]) - 5} more")

        print("\n" + "="*80)


def main():
    """Main entry point"""
    # Get root path
    root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_types_path = os.path.join(root_path, 'lib', 'types', 'database.types.ts')
    output_path = os.path.join(root_path, 'docs', 'schema-scan-report.json')

    print("🔍 Database Schema Scanner & Mismatch Detector")
    print("="*80)
    print(f"Root path: {root_path}")
    print(f"Database types: {db_types_path}")
    print(f"Output: {output_path}")
    print()

    # Parse database schema
    print("📊 Parsing database schema...")
    try:
        db_parser = DatabaseSchemaParser(db_types_path)
        db_parser.parse()
        print(f"   ✅ Found {len(db_parser.schemas)} schemas")
        print(f"   ✅ Found {sum(len(t) for t in db_parser.tables.values())} tables")
        print(f"   ✅ Found {sum(len(v) for v in db_parser.views.values())} views")
        print(f"   ✅ Found {sum(len(f) for f in db_parser.functions.values())} RPC functions")
    except Exception as e:
        print(f"   ❌ Error parsing database schema: {e}")
        sys.exit(1)

    # Scan code
    print("\n🔎 Scanning TypeScript/TSX files for database access...")
    try:
        scanner = CodeScanner(root_path)
        matches = scanner.scan()
        print(f"   ✅ Found {len(matches)} database access patterns")
        from_calls = sum(1 for m in matches if m.type == 'from')
        rpc_calls = sum(1 for m in matches if m.type == 'rpc')
        schema_calls = sum(1 for m in matches if m.type == 'schema')
        print(f"      - {from_calls} .from() calls")
        print(f"      - {rpc_calls} .rpc() calls")
        print(f"      - {schema_calls} .schema() calls")
    except Exception as e:
        print(f"   ❌ Error scanning code: {e}")
        sys.exit(1)

    # Detect mismatches
    print("\n🔗 Detecting mismatches...")
    try:
        detector = MismatchDetector(db_parser, matches)
        mismatches = detector.detect()
        print(f"   ✅ Found {len(mismatches)} mismatches")
        critical = sum(1 for m in mismatches if m.severity == 'critical')
        high = sum(1 for m in mismatches if m.severity == 'high')
        medium = sum(1 for m in mismatches if m.severity == 'medium')
        low = sum(1 for m in mismatches if m.severity == 'low')
        print(f"      - {critical} critical")
        print(f"      - {high} high")
        print(f"      - {medium} medium")
        print(f"      - {low} low")
    except Exception as e:
        print(f"   ❌ Error detecting mismatches: {e}")
        sys.exit(1)

    # Generate report
    print("\n📄 Generating JSON report...")
    try:
        ScannerReporter.generate_json_report(db_parser, matches, mismatches, output_path)
    except Exception as e:
        print(f"   ❌ Error generating report: {e}")
        sys.exit(1)

    # Print summary
    ScannerReporter.print_summary(mismatches)

    return 0


if __name__ == '__main__':
    sys.exit(main())
