#!/usr/bin/env python3
"""
Comprehensive Database Schema Scanner & Analyzer

Runs both scanner and analyzer in sequence to provide complete database
schema validation and recommendations.

Usage:
    python3 scripts/scan-and-analyze.py

Output:
    - docs/schema-scan-report.json (detailed mismatch report)
    - Console output with analysis and recommendations
"""

import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime


class Colors:
    """ANSI color codes"""
    GREEN = '\033[0;32m'
    BLUE = '\033[0;34m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    NC = '\033[0m'  # No Color


def main():
    """Run scanner and analyzer"""
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    print(f"{Colors.BLUE}🔍 ENORAE Database Schema Scanner & Analyzer{Colors.NC}")
    print("=" * 50)
    print()

    print(f"{Colors.BLUE}📍 Project root: {project_root}{Colors.NC}")
    print(f"{Colors.BLUE}Python version:{Colors.NC}")
    result = subprocess.run([sys.executable, "--version"], capture_output=True, text=True)
    print(result.stdout)

    # Step 1: Run Scanner
    print(f"{Colors.BLUE}Step 1: Running Database Schema Scanner...{Colors.NC}")
    print("─" * 50)

    scanner_script = script_dir / "database-schema-scanner.py"
    result = subprocess.run([sys.executable, str(scanner_script)], cwd=project_root)

    if result.returncode != 0:
        print(f"{Colors.RED}❌ Scanner failed{Colors.NC}")
        return 1

    print(f"{Colors.GREEN}✅ Scanner completed successfully{Colors.NC}")
    print()

    # Step 2: Run Analyzer
    print(f"{Colors.BLUE}Step 2: Running Analysis & Recommendations...{Colors.NC}")
    print("─" * 50)

    analyzer_script = script_dir / "analyze-schema-scan.py"
    result = subprocess.run([sys.executable, str(analyzer_script)], cwd=project_root)

    if result.returncode != 0:
        print(f"{Colors.RED}❌ Analysis failed{Colors.NC}")
        return 1

    print(f"{Colors.GREEN}✅ Analysis completed successfully{Colors.NC}")
    print()

    # Summary
    print("=" * 50)
    print(f"{Colors.GREEN}✅ Complete Database Schema Scan Finished{Colors.NC}")
    print("=" * 50)
    print()

    print(f"{Colors.BLUE}📊 Generated Reports:{Colors.NC}")
    report_path = project_root / "docs" / "schema-scan-report.json"
    print(f"   • {report_path}")
    print()

    # Show quick stats
    if report_path.exists():
        print(f"{Colors.BLUE}📈 Quick Stats:{Colors.NC}")
        try:
            with open(report_path, 'r') as f:
                report = json.load(f)

            summary = report.get('mismatch_summary', {})
            print(f"   Total Mismatches: {summary.get('total_mismatches', 0)}")
            print(f"   Critical: {summary.get('critical', 0)}")
            print(f"   High: {summary.get('high', 0)}")
            print(f"   Medium: {summary.get('medium', 0)}")
            print(f"   Low: {summary.get('low', 0)}")
        except Exception as e:
            print(f"   Error reading report: {e}")

        print()

    print(f"{Colors.BLUE}→ Next Steps:{Colors.NC}")
    print("   1. Review the critical mismatches above")
    print("   2. Use database-alignment-fixer agent to fix issues")
    print("   3. Run this script again to verify fixes")
    print()

    print(f"{Colors.GREEN}Done!{Colors.NC}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
