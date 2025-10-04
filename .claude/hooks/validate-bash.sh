#!/bin/bash
# Bash Command Validator Hook
# Runs before Bash tool calls
# Prevents common installation and command mistakes

# Get the command from the tool call
COMMAND="$1"

# Exit if no command provided
if [ -z "$COMMAND" ]; then
    exit 0
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 1: Block shadcn component installations (all pre-installed)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$COMMAND" =~ npx[[:space:]]+shadcn ]]; then
    echo "❌ BLOCKED: Cannot install shadcn components"
    echo ""
    echo "📋 Project Rule: ALL shadcn/ui components are already installed"
    echo ""
    echo "❌ Blocked command: npx shadcn add ..."
    echo ""
    echo "✅ Just import the component:"
    echo "   import { Button } from '@/components/ui/button'"
    echo "   import { Dialog } from '@/components/ui/dialog'"
    echo "   import { Input } from '@/components/ui/input'"
    echo ""
    echo "📂 Available in: components/ui/"
    exit 1
fi

# Also block @shadcn/ui or shadcn-ui package installs
if [[ "$COMMAND" =~ (npm|pnpm|yarn|bun)[[:space:]]+(install|add)[[:space:]]+.*(@shadcn|shadcn-ui) ]]; then
    echo "❌ BLOCKED: Cannot install shadcn packages"
    echo ""
    echo "📋 Project Rule: ALL shadcn/ui components are already installed"
    echo ""
    echo "✅ Just import the component you need from @/components/ui/"
    exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 2: Warn on UI library installations (likely already installed)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$COMMAND" =~ (npm|pnpm|yarn|bun)[[:space:]]+(install|add)[[:space:]]+.*(@radix-ui|@headlessui|framer-motion|tailwindcss) ]]; then
    echo "⚠️  WARNING: Attempting to install UI library"
    echo ""
    echo "📋 Note: Most UI dependencies are already installed"
    echo ""
    echo "⚠️  Command: $COMMAND"
    echo ""
    echo "❓ Check package.json first:"
    echo "   cat package.json | grep -A 5 dependencies"
    echo ""
    echo "❓ Do you really need to install this?"
    echo ""
    echo "⏭️  Proceeding anyway (warning only)..."
    echo ""
    # Don't block, just warn
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 3: Block creation of tailwind.config files
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$COMMAND" =~ (cat|echo|touch).*tailwind\.config ]]; then
    echo "❌ BLOCKED: Cannot create tailwind.config files"
    echo ""
    echo "📋 Project Rule: Tailwind CSS 4 uses CSS-only configuration"
    echo ""
    echo "✅ Configure Tailwind in: app/globals.css"
    echo "   @theme inline { ... }"
    exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 4: Warn on potentially destructive operations
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$COMMAND" =~ ^rm[[:space:]]+-rf ]]; then
    echo "⚠️  WARNING: Destructive operation detected"
    echo ""
    echo "⚠️  Command: $COMMAND"
    echo ""
    echo "❓ Are you sure you want to do this?"
    echo ""
    echo "⏭️  Proceeding anyway (warning only)..."
    echo ""
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 5: Block Supabase schema modifications (without permission)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$COMMAND" =~ supabase.*(migration|db[[:space:]]+push) ]] && [[ "$COMMAND" =~ (CREATE[[:space:]]+TABLE|ALTER[[:space:]]+TABLE|DROP[[:space:]]+TABLE) ]]; then
    echo "❌ BLOCKED: Database schema modifications require user permission"
    echo ""
    echo "📋 Project Rule: Never modify database structure without permission"
    echo ""
    echo "⚠️  Command: $COMMAND"
    echo ""
    echo "❓ Ask the user first:"
    echo "   'Do you want me to create/modify database tables?'"
    exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RULE 6: Remind about public views for database queries
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if [[ "$COMMAND" =~ supabase.*sql ]] && [[ "$COMMAND" =~ FROM[[:space:]]+[a-z]+\.[a-z]+ ]]; then
    echo "⚠️  WARNING: Possible schema table query detected"
    echo ""
    echo "📋 Project Rule: Always query from public views (not schema.table)"
    echo ""
    echo "❌ Wrong: FROM scheduling.appointments"
    echo "✅ Right: FROM appointments"
    echo ""
    echo "⏭️  Proceeding anyway (warning only)..."
    echo ""
fi

# All checks passed
exit 0
