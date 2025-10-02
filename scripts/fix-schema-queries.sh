#!/bin/bash

# Script to fix all .schema() queries in dal/*.queries.ts files
# Changes SELECT queries to use public views instead of schema.table
# IMPORTANT: Does NOT modify actions files (mutations need schema.table)

set -e

echo "🔧 Fixing schema queries in dal/*.queries.ts files..."
echo "=================================================="

# Find all *.queries.ts files
QUERY_FILES=$(find features -name "*.queries.ts" -type f)
FILE_COUNT=$(echo "$QUERY_FILES" | wc -l | tr -d ' ')

echo "Found $FILE_COUNT query files to update"
echo ""

for file in $QUERY_FILES; do
  echo "Updating: $file"

  # Create backup
  cp "$file" "$file.bak"

  # Fix Type definitions in queries files - change Tables to Views
  # Pattern: Database['<schema>']['Tables']['<table>'] → Database['public']['Views']['<table>']
  sed -i '' \
    -e "s/Database\['\([^']*\)'\]\['Tables'\]\['\([^']*\)'\]/Database['public']['Views']['\2']/g" \
    "$file"

  # Remove .schema() calls for SELECT queries
  # Pattern: .schema('organization').from('staff_profiles') → .from('staff')
  sed -i '' \
    -e "s/\.schema('organization')\.from('staff_profiles')/\.from('staff')/g" \
    "$file"

  # Pattern: .schema('<schema>').from('<table>') → .from('<table>')
  sed -i '' \
    -e "s/\.schema('[^']*')\.from('\([^']*\)')/\.from('\1')/g" \
    "$file"

  # Remove comment blocks about keeping .schema() calls
  sed -i '' \
    -e '/\/\/ Keeping \.schema() calls until public views are created/d' \
    "$file"

  echo "  ✅ Updated"
done

echo ""
echo "=================================================="
echo "✅ Updated $FILE_COUNT query files"
echo "⚠️  Backups saved as *.queries.ts.bak"
echo ""
echo "Next steps:"
echo "  1. Review changes with: git diff features"
echo "  2. Run type check: pnpm typecheck"
echo "  3. Remove backups if satisfied: find features -name '*.bak' -delete"
