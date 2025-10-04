#!/bin/bash
# Session Start Hook - Shows project structure and critical reminders
# Runs once at the start of every Claude Code session

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ENORAE SALON BOOKING PLATFORM - $(date '+%Y-%m-%d %H:%M')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📂 EXISTING FEATURES (47 total):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# List all features in columns
if [ -d "features" ]; then
    ls -1 features/ | pr -t -4 -w 80 | sed 's/^/  /'
else
    echo "  ⚠️  features/ directory not found"
fi

echo ""
echo "🎯 APP STRUCTURE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  • app/(admin)/      → Platform admin portal"
echo "  • app/(business)/   → Business dashboard"
echo "  • app/(customer)/   → Customer portal"
echo "  • app/(staff)/      → Staff portal"
echo "  • app/(marketing)/  → Public pages"
echo ""
echo "  • components/ui/    → shadcn/ui primitives (ALL PRE-INSTALLED)"
echo "  • components/layout/    → Layout system (Stack, Grid, Flex, Box)"
echo "  • components/shared/    → Compound components (Cards)"
echo "  • components/typography/→ Typography (H1-H6, P, Lead, Muted)"
echo ""

echo "⚠️  CRITICAL REMINDERS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ❌ NEVER query schema tables (use public views)"
echo "     Wrong: supabase.schema('scheduling').from('appointments')"
echo "     Right: supabase.from('appointments')"
echo ""
echo "  ❌ NEVER use Tables types (use Views types)"
echo "     Wrong: Database['public']['Tables']['salons']['Row']"
echo "     Right: Database['public']['Views']['salons']['Row']"
echo ""
echo "  ❌ NEVER create .md files (project rule)"
echo ""
echo "  ❌ NEVER install shadcn components (all pre-installed)"
echo "     Just import: import { Button } from '@/components/ui/button'"
echo ""
echo "  ✅ Pages MUST be 5-15 lines (only render feature components)"
echo ""
echo "  ✅ DAL files MUST start with: import 'server-only'"
echo ""
echo "  ✅ Use kebab-case for all file names"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📖 Read CLAUDE.md for complete guidelines"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit 0
