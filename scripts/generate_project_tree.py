#!/usr/bin/env python3
"""
Generate an AI-readable project tree for the ENORAE repo.

The script walks the repository from the repo root, builds a structured
representation of directories and files (excluding common vendor/temp
folders), and writes the result to docs/project-tree-ai.json.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Dict, List


ROOT_IGNORE_DIRS = {
    ".codex",
    ".claude",
    ".git",
    ".github",
    ".husky",
    ".next",
    ".turbo",
    ".vscode",
    "docs",
    "node_modules",
    "scripts",
    "supabase/.branches",  # safety for branch caches if present
}

REPO_IGNORE_DIRS = {
    ".git",
    ".next",
    ".turbo",
    ".vscode",
    "__pycache__",
    "node_modules",
    "build",
    "dist",
    "tmp",
}

REPO_IGNORE_FILES = {
    ".DS_Store",
}


def should_skip_dir(name: str, depth: int) -> bool:
    if name in REPO_IGNORE_DIRS:
        return True
    if depth == 0 and name in ROOT_IGNORE_DIRS:
        return True
    return False


def build_tree(directory: Path, depth: int = 0) -> List[Dict[str, object]]:
    """Recursively build the tree representation from the given directory."""
    entries: List[Dict[str, object]] = []

    for entry in sorted(directory.iterdir(), key=lambda p: (p.is_file(), p.name.lower())):
        if entry.is_dir():
            if should_skip_dir(entry.name, depth):
                continue
            entries.append(
                {
                    "type": "directory",
                    "name": entry.name,
                    "children": build_tree(entry, depth + 1),
                }
            )
        else:
            if entry.name in REPO_IGNORE_FILES:
                continue
            entries.append(
                {
                    "type": "file",
                    "name": entry.name,
                }
            )

    return entries


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    output_path = repo_root / "docs" / "project-tree-ai.json"

    tree = {
        "root": "/",
        "children": build_tree(repo_root),
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(tree, indent=2), encoding="utf-8")

    print(f"Wrote project tree to {output_path.relative_to(repo_root)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
