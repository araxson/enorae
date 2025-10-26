#!/usr/bin/env python3
"""
Schema Scan Analyzer

Reads the JSON report from database-schema-scanner.py and provides:
1. Detailed analysis of mismatches
2. Actionable recommendations
3. Affected files and impact assessment
4. Fix priority ranking
"""

import json
import sys
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Any

class ScanAnalyzer:
    """Analyzes schema scan results"""

    def __init__(self, report_path: str):
        self.report_path = report_path
        self.report = self._load_report()

    def _load_report(self) -> Dict[str, Any]:
        """Load the JSON report"""
        if not Path(self.report_path).exists():
            raise FileNotFoundError(f"Report not found: {self.report_path}")

        with open(self.report_path, 'r') as f:
            return json.load(f)

    def get_mismatch_summary(self) -> Dict[str, Any]:
        """Get summary statistics"""
        return self.report.get('mismatch_summary', {})

    def get_affected_files(self) -> Dict[str, List[Dict]]:
        """Get affected files grouped by severity"""
        affected = defaultdict(list)

        for file, mismatches in self.report.get('mismatches_by_file', {}).items():
            critical_count = sum(1 for m in mismatches if m['severity'] == 'critical')
            total = len(mismatches)

            affected['files'].append({
                'file': file,
                'total_mismatches': total,
                'critical': critical_count,
                'priority': critical_count * 10 + total
            })

        # Sort by priority (critical count + total)
        affected['files'].sort(key=lambda x: x['priority'], reverse=True)

        return affected

    def get_fix_recommendations(self) -> List[Dict[str, Any]]:
        """Get prioritized recommendations"""
        recommendations = []

        # Group by type
        by_type = self.report.get('mismatches_by_type', {})

        for mtype, mismatches in by_type.items():
            if not mismatches:
                continue

            examples = mismatches[:3]
            recommendation = {
                'type': mtype,
                'count': len(mismatches),
                'severity': mismatches[0].get('severity', 'unknown'),
                'examples': examples,
                'fix_approach': self._get_fix_approach(mtype),
                'estimated_effort': self._estimate_effort(mtype, len(mismatches))
            }
            recommendations.append(recommendation)

        # Sort by severity and count
        severity_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        recommendations.sort(
            key=lambda x: (severity_order.get(x['severity'], 4), -x['count'])
        )

        return recommendations

    def _get_fix_approach(self, mtype: str) -> str:
        """Get fix approach for a mismatch type"""
        approaches = {
            'table_not_found': 'Verify table exists in database. Use correct schema prefix or check table naming.',
            'view_not_found': 'Verify view exists in database. Add _view suffix if needed or use correct schema.',
            'rpc_not_found': 'Implement missing RPC function in database or use table operations instead.',
            'schema_not_found': 'Use correct schema name. Check available schemas in database.types.ts',
            'property_possibly_not_found': 'Verify property is returned by query or add separate join/lookup.',
        }
        return approaches.get(mtype, 'Review database schema and update code to match.')

    def _estimate_effort(self, mtype: str, count: int) -> str:
        """Estimate effort to fix"""
        if count <= 5:
            return 'Low (< 30 min)'
        elif count <= 20:
            return 'Medium (30-120 min)'
        elif count <= 50:
            return 'High (2-4 hours)'
        else:
            return 'Very High (4+ hours)'

    def generate_analysis_report(self, output_path: str) -> None:
        """Generate analysis report as JSON"""
        analysis = {
            'summary': self.get_mismatch_summary(),
            'affected_files': self.get_affected_files(),
            'recommendations': self.get_fix_recommendations(),
            'next_steps': self._get_next_steps()
        }

        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(analysis, f, indent=2)

        print(f"✅ Analysis report generated: {output_path}")

    def _get_next_steps(self) -> List[str]:
        """Get recommended next steps"""
        summary = self.get_mismatch_summary()
        critical = summary.get('critical', 0)

        steps = []

        if critical > 0:
            steps.append(f"🚨 Fix {critical} critical mismatches first - these break the code")

        if summary.get('high', 0) > 0:
            steps.append(f"⚠️  Address {summary.get('high', 0)} high-priority mismatches")

        if summary.get('total_mismatches', 0) > 20:
            steps.append("📊 Use the file-by-file breakdown to prioritize by impact")

        steps.append("✅ Run database-schema-scanner.py again after fixes to verify resolution")

        return steps

    def print_analysis(self) -> None:
        """Print analysis to console"""
        print("\n" + "="*80)
        print("SCHEMA SCAN ANALYSIS & RECOMMENDATIONS")
        print("="*80)

        # Summary
        summary = self.get_mismatch_summary()
        print(f"\n📊 SUMMARY:")
        print(f"   Total Mismatches: {summary.get('total_mismatches', 0)}")
        print(f"   Critical: {summary.get('critical', 0)}")
        print(f"   High: {summary.get('high', 0)}")
        print(f"   Medium: {summary.get('medium', 0)}")
        print(f"   Low: {summary.get('low', 0)}")

        # Top affected files
        print(f"\n📁 TOP AFFECTED FILES:")
        affected = self.get_affected_files()
        for file_info in affected['files'][:10]:
            print(f"   {file_info['file']}")
            print(f"      Total: {file_info['total_mismatches']}, Critical: {file_info['critical']}")

        # Recommendations
        print(f"\n💡 FIX RECOMMENDATIONS (by priority):")
        for rec in self.get_fix_recommendations():
            print(f"\n   {rec['type'].upper()} ({rec['count']} issues)")
            print(f"      Severity: {rec['severity']}")
            print(f"      Effort: {rec['estimated_effort']}")
            print(f"      Approach: {rec['fix_approach']}")
            if rec['examples']:
                print(f"      Example:")
                for ex in rec['examples'][:1]:
                    print(f"         - {ex['file']}:{ex['line']}")
                    print(f"           {ex['issue']}")

        # Next steps
        print(f"\n→ NEXT STEPS:")
        for step in self._get_next_steps():
            print(f"   {step}")

        print("\n" + "="*80)


def main():
    """Main entry point"""
    root_path = Path(__file__).parent.parent
    report_path = root_path / 'docs' / 'schema-scan-report.json'
    analysis_path = root_path / 'docs' / 'schema-scan-analysis.json'

    print("📈 Schema Scan Analyzer")
    print("="*80)

    try:
        analyzer = ScanAnalyzer(str(report_path))
        analyzer.print_analysis()
        analyzer.generate_analysis_report(str(analysis_path))
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("\nFirst, run: python scripts/database-schema-scanner.py")
        return 1
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

    return 0


if __name__ == '__main__':
    sys.exit(main())
