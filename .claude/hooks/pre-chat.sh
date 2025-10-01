#!/bin/bash

# Claude Code Pre-Chat Hook
# This hook ensures Claude reads critical project documentation before starting any work

echo "🔍 MANDATORY: Reading project configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Step 1: READ CLAUDE.md - Project rules and configuration"
echo "   Location: /Users/afshin/Desktop/Enorae/CLAUDE.md"
echo ""
echo "🌳 Step 2: Generate fresh project structure"
echo "   Running: python scripts/generate_project_tree.py"
python /Users/afshin/Desktop/Enorae/scripts/generate_project_tree.py > /dev/null 2>&1
echo "   ✅ Project tree generated"
echo ""
echo "📚 Step 3: READ project structure documentation"
echo "   Location: /Users/afshin/Desktop/Enorae/docs/architecture/project-structure.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  CRITICAL REMINDERS FROM CLAUDE.md:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. ❌ NEVER create custom database types - use @enorae/infrastructure"
echo "2. ❌ NEVER create custom UI components - use @enorae/ui (existing shadcn)"
echo "3. ✅ ALWAYS check auth in DAL functions"
echo "4. ✅ ALWAYS use kebab-case for file names"
echo "5. ❌ NO src folders - use flat structure"
echo "6. ✅ Import from '@enorae/ui' for ALL UI components"
echo "7. ✅ Database types location: packages/infrastructure/src/database/types/database.types.ts"
echo ""
echo "🚀 REQUIRED READING COMPLETE - You may now proceed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"