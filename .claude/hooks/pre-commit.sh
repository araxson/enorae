#!/bin/bash

# Claude Code Pre-Commit Hook
# Validates code against project rules before allowing commits

echo "🔍 Running pre-commit validation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ERRORS=0

# Check for forbidden patterns
echo "Checking for forbidden patterns..."

# Check for custom database type definitions
if grep -r "interface.*{.*id:.*string.*name:.*string" --include="*.ts" --include="*.tsx" apps/ services/ 2>/dev/null | grep -v node_modules; then
    echo "❌ ERROR: Found custom database type definitions! Use @enorae/infrastructure instead"
    ERRORS=$((ERRORS + 1))
fi

# Check for src folders
if find apps services packages -type d -name "src" 2>/dev/null | grep -v node_modules; then
    echo "❌ ERROR: Found 'src' folders! Use flat structure instead"
    ERRORS=$((ERRORS + 1))
fi

# Check for custom UI component creation
if grep -r "export.*function.*Button\|export.*const.*Button" --include="*.tsx" apps/ 2>/dev/null | grep -v node_modules | grep -v "@enorae/ui"; then
    echo "❌ ERROR: Found custom UI components! Import from @enorae/ui instead"
    ERRORS=$((ERRORS + 1))
fi

# Check for missing auth in DAL files
if grep -l "supabase\." services/*/dal/*.ts 2>/dev/null | while read file; do
    if ! grep -q "auth.getUser()" "$file"; then
        echo "❌ ERROR: Missing auth check in DAL file: $file"
        return 1
    fi
done; then
    ERRORS=$((ERRORS + 1))
fi

# Check file naming conventions
echo "Checking file naming conventions..."
if find apps services -name "*.tsx" -o -name "*.ts" 2>/dev/null | grep -E "[A-Z]" | grep -v node_modules | grep -v ".next"; then
    echo "⚠️  WARNING: Found files not using kebab-case naming"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -gt 0 ]; then
    echo "❌ Pre-commit validation FAILED with $ERRORS errors"
    echo "Please fix the errors above before committing"
    exit 1
else
    echo "✅ Pre-commit validation PASSED"
    exit 0
fi