#!/bin/bash

# Claude Code Pre-File-Write Hook
# This hook validates file operations against documentation rules

set -e

FILE_PATH="$1"
OPERATION="$2"  # create, edit, delete

PROJECT_ROOT="/Users/afshin/Desktop/Enorae"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check file naming
check_file_naming() {
    local file="$1"
    local basename=$(basename "$file")
    local dirname=$(dirname "$file")

    # Check for forbidden suffixes
    if [[ "$basename" =~ -v[0-9]|[-_](new|old|fixed|temp|backup|copy) ]]; then
        echo -e "${RED}❌ FORBIDDEN: File name contains forbidden suffix: $basename${NC}"
        echo -e "${YELLOW}   Rule: Never use suffixes like -v2, -new, -old, -fixed, -temp${NC}"
        echo -e "${YELLOW}   See: docs/02-architecture/naming-conventions.md${NC}"
        return 1
    fi

    # Check kebab-case for components
    if [[ "$file" =~ \.tsx$ ]] && [[ ! "$file" =~ app/.*(page|layout|loading|error|not-found)\.tsx$ ]]; then
        if [[ ! "$basename" =~ ^[a-z][a-z0-9]*(-[a-z0-9]+)*\.tsx$ ]]; then
            echo -e "${RED}❌ FORBIDDEN: Component not in kebab-case: $basename${NC}"
            echo -e "${YELLOW}   Rule: Components must use kebab-case.tsx${NC}"
            echo -e "${YELLOW}   Example: salon-card.tsx, booking-form.tsx${NC}"
            echo -e "${YELLOW}   See: docs/02-architecture/naming-conventions.md${NC}"
            return 1
        fi
    fi

    # Check DAL naming
    if [[ "$file" =~ features/.*dal/.*\.ts$ ]]; then
        if [[ ! "$basename" =~ ^[a-z][a-z0-9-]*\.queries\.ts$ ]]; then
            echo -e "${RED}❌ FORBIDDEN: DAL file not following pattern: $basename${NC}"
            echo -e "${YELLOW}   Rule: DAL files must be [feature].queries.ts${NC}"
            echo -e "${YELLOW}   Example: salon.queries.ts, booking.queries.ts${NC}"
            echo -e "${YELLOW}   See: docs/02-architecture/naming-conventions.md${NC}"
            return 1
        fi
    fi

    # Check actions naming
    if [[ "$file" =~ features/.*actions/.*\.ts$ ]]; then
        if [[ ! "$basename" =~ ^[a-z][a-z0-9-]*\.actions\.ts$ ]]; then
            echo -e "${RED}❌ FORBIDDEN: Actions file not following pattern: $basename${NC}"
            echo -e "${YELLOW}   Rule: Actions files must be [feature].actions.ts${NC}"
            echo -e "${YELLOW}   Example: salon.actions.ts, booking.actions.ts${NC}"
            echo -e "${YELLOW}   See: docs/02-architecture/naming-conventions.md${NC}"
            return 1
        fi
    fi

    return 0
}

# Function to check DAL file content
check_dal_content() {
    local file="$1"

    if [[ ! "$file" =~ \.queries\.ts$ ]]; then
        return 0
    fi

    # Check if file exists (for edits)
    if [[ ! -f "$file" ]]; then
        echo -e "${YELLOW}⚠️  NEW DAL FILE: $file${NC}"
        echo -e "${YELLOW}   REMINDER: Must include:${NC}"
        echo -e "${YELLOW}   • import 'server-only' (first line)${NC}"
        echo -e "${YELLOW}   • auth.getUser() check in every function${NC}"
        echo -e "${YELLOW}   • Query from public views only (.from('view_name'))${NC}"
        echo -e "${YELLOW}   • Use Database['public']['Views'] for types${NC}"
        echo -e "${YELLOW}   See: docs/04-frontend/component-patterns.md${NC}"
        return 0
    fi

    # Check for server-only directive
    if ! grep -q "^import 'server-only'" "$file" 2>/dev/null; then
        echo -e "${RED}❌ FORBIDDEN: Missing 'server-only' directive in DAL file${NC}"
        echo -e "${YELLOW}   Rule: All DAL files MUST start with: import 'server-only'${NC}"
        echo -e "${YELLOW}   File: $file${NC}"
        echo -e "${YELLOW}   See: docs/04-frontend/component-patterns.md${NC}"
        return 1
    fi

    # Check for schema queries (forbidden)
    if grep -q "\.schema(" "$file" 2>/dev/null; then
        echo -e "${RED}❌ FORBIDDEN: Direct schema query detected${NC}"
        echo -e "${YELLOW}   Rule: NEVER query schema tables directly${NC}"
        echo -e "${YELLOW}   Use: .from('view_name') instead of .schema('schema_name').from(...)${NC}"
        echo -e "${YELLOW}   See: docs/03-database/best-practices.md${NC}"
        return 1
    fi

    # Check for Tables type usage (should use Views)
    if grep -q "from 'Tables'" "$file" 2>/dev/null; then
        echo -e "${RED}❌ FORBIDDEN: Using Tables types instead of Views${NC}"
        echo -e "${YELLOW}   Rule: Use Database['public']['Views'] for types${NC}"
        echo -e "${YELLOW}   Reason: Tables types miss cross-schema relationships${NC}"
        echo -e "${YELLOW}   See: docs/04-frontend/component-patterns.md${NC}"
        return 1
    fi

    return 0
}

# Function to check forbidden database operations
check_database_operations() {
    local file="$1"

    # Check for database migrations (only allowed with permission)
    if [[ "$file" =~ supabase/migrations/.*\.sql$ ]]; then
        echo -e "${RED}❌ STOP: Database migration detected${NC}"
        echo -e "${YELLOW}   Rule: NEVER create/modify database schema without explicit permission${NC}"
        echo -e "${YELLOW}   File: $file${NC}"
        echo -e "${YELLOW}   See: CLAUDE.md - Critical Rules${NC}"
        echo ""
        echo -e "${YELLOW}   Has the user explicitly requested database changes? (y/n)${NC}"
        return 1
    fi

    # Check for custom type definitions
    if [[ "$file" =~ \.types\.ts$ ]] && [[ -f "$file" ]]; then
        if grep -qE "(interface|type).*Salon|Staff|Service|Appointment" "$file" 2>/dev/null; then
            echo -e "${YELLOW}⚠️  WARNING: Custom type definitions detected${NC}"
            echo -e "${YELLOW}   Rule: Import types from @/lib/types/database.types${NC}"
            echo -e "${YELLOW}   Don't create custom types for database entities${NC}"
            echo -e "${YELLOW}   See: docs/04-frontend/component-patterns.md${NC}"
        fi
    fi

    return 0
}

# Function to check UI component creation
check_ui_components() {
    local file="$1"

    # Check if creating primitive UI component
    if [[ "$file" =~ components/ui/.* ]] && [[ ! -f "$file" ]]; then
        echo -e "${RED}❌ FORBIDDEN: Creating new UI primitive component${NC}"
        echo -e "${YELLOW}   Rule: ONLY use existing shadcn/ui components${NC}"
        echo -e "${YELLOW}   File: $file${NC}"
        echo -e "${YELLOW}   See: CLAUDE.md - UI Component Rules${NC}"
        return 1
    fi

    return 0
}

# Main validation
echo -e "${GREEN}🔍 Validating file operation: $OPERATION${NC}"
echo -e "${GREEN}📁 File: $FILE_PATH${NC}"
echo ""

# Run checks
check_file_naming "$FILE_PATH" || exit 1
check_dal_content "$FILE_PATH" || exit 1
check_database_operations "$FILE_PATH" || exit 1
check_ui_components "$FILE_PATH" || exit 1

echo -e "${GREEN}✅ File validation passed${NC}"
echo ""
exit 0
