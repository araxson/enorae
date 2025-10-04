#!/bin/bash
# File Write Validator Hook
# Runs before Write and Edit tool calls
# Validates file operations against CLAUDE.md rules

# Get the file path from the tool call
# For Write tool: first argument is file_path
# For Edit tool: first argument is file_path
FILE_PATH="$1"

# Exit if no file path provided
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Extract filename and directory
FILENAME=$(basename "$FILE_PATH")
DIRNAME=$(dirname "$FILE_PATH")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 1: Block .md files (ABSOLUTE rule)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$FILENAME" == *.md ]]; then
    echo "❌ BLOCKED: Cannot create .md files"
    echo ""
    echo "📋 Project Rule: ABSOLUTELY DO NOT CREATE .md files"
    echo ""
    echo "ℹ️  If you need to document something, use code comments or update existing docs."
    exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 2: Block Tailwind config files (Tailwind 4 uses CSS-only config)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$FILENAME" =~ ^tailwind\.config\.(ts|js|mjs|cjs)$ ]]; then
    echo "❌ BLOCKED: Cannot create tailwind.config files"
    echo ""
    echo "📋 Project Rule: Tailwind CSS 4 uses CSS-only configuration"
    echo ""
    echo "✅ Configure Tailwind in: app/globals.css"
    echo "   Example:"
    echo "   @theme inline {"
    echo "     --color-primary: oklch(0.205 0 0);"
    echo "   }"
    exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 3: Block file suffixes (-v2, -new, -fixed, -old, -temp)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$FILENAME" =~ -(v2|v3|new|fixed|old|temp|backup|copy)\.(ts|tsx|js|jsx)$ ]]; then
    echo "❌ BLOCKED: File suffixes not allowed"
    echo ""
    echo "📋 Project Rule: No file suffixes like -v2, -new, -fixed, -old, -temp"
    echo ""
    echo "❌ Wrong: ${FILENAME}"
    echo "✅ Right: Edit the existing file or use a proper name"
    echo ""
    echo "ℹ️  If you need to modify a file, edit it directly."
    exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 4: Warn on non-kebab-case files in features/ and components/
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$DIRNAME" =~ (features|components)/ ]]; then
    # Check if filename is kebab-case (lowercase, hyphens, numbers, dots)
    if [[ ! "$FILENAME" =~ ^[a-z0-9][a-z0-9-]*(\.[a-z0-9]+)*$ ]]; then
        echo "⚠️  WARNING: File naming convention violation"
        echo ""
        echo "📋 Project Rule: Use kebab-case for files in features/ and components/"
        echo ""
        echo "⚠️  Current: ${FILENAME}"
        echo "✅ Example: salon-card.tsx, use-salon-filters.ts, salon.queries.ts"
        echo ""
        echo "⏭️  Proceeding anyway (warning only)..."
        echo ""
        # Don't block, just warn
    fi
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 5: Validate DAL files have 'server-only' directive
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$FILE_PATH" =~ /dal/.*\.queries\.ts$ ]]; then
    # Check if file content (from stdin or tool params) contains 'server-only'
    # Note: We can't easily check file content in PreToolUse hook
    # So just provide a reminder
    echo "ℹ️  REMINDER: DAL files must start with: import 'server-only'"
    echo ""
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 6: Warn on page files that might be too complex
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$FILE_PATH" =~ app/.*page\.tsx$ ]]; then
    echo "ℹ️  REMINDER: Pages must be 5-15 lines (ultra-thin pattern)"
    echo "   • Only render feature component(s)"
    echo "   • No business logic, data fetching, or complex layouts"
    echo ""
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 7: Block creation of custom UI primitives in components/ui/
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$FILE_PATH" =~ components/ui/[^/]+\.tsx$ ]]; then
    # Check if it's not one of the known shadcn components
    COMPONENT_NAME=$(basename "$FILE_PATH" .tsx)

    # Known shadcn components (partial list)
    KNOWN_COMPONENTS="button|card|dialog|input|label|select|checkbox|radio|switch|slider|textarea|separator|tabs|sheet|drawer|popover|accordion|alert|avatar|badge|calendar|carousel|chart|collapsible|command|context-menu|dropdown-menu|hover-card|menubar|navigation-menu|progress|resizable|scroll-area|skeleton|sonner|table|toast|toggle|tooltip|typography"

    if [[ ! "$COMPONENT_NAME" =~ ^($KNOWN_COMPONENTS)$ ]]; then
        echo "⚠️  WARNING: Creating custom UI component in components/ui/"
        echo ""
        echo "📋 Project Rule: All shadcn/ui components are pre-installed"
        echo ""
        echo "⚠️  Component: ${COMPONENT_NAME}"
        echo ""
        echo "❓ Are you sure this isn't already available?"
        echo "   • Check: components/ui/ for existing components"
        echo "   • All shadcn/ui components are already installed"
        echo ""
        echo "✅ If this is a compound component, put it in components/shared/"
        echo ""
        echo "⏭️  Proceeding anyway (warning only)..."
        echo ""
    fi
fi

# All checks passed
exit 0
