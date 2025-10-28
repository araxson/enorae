---
title: Button
description: Displays a button or a component that looks like a button.
featured: true
component: true
---

import { InfoIcon } from "lucide-react"

<Callout variant="info" icon={<InfoIcon />}>
**Updated:** We have updated the button component to add new sizes: `icon-sm` and `icon-lg`. See the
[changelog](/docs/components/button#changelog) for more details. Follow the
instructions to update your project.

</Callout>

```tsx
import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}

```

```tsx showLineNumbers
<Button variant="outline">Button</Button>
<Button variant="outline" size="icon" aria-label="Submit">
  <ArrowUpIcon />
</Button>
```

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add button
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-slot
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="button" title="components/ui/button.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

When pairing a button with an input, wrap it in an `InputGroupAddon` so the control picks up the correct spacing and border radius from the group.

```tsx
import { Button } from "@/components/ui/button"
```

```tsx
<Button variant="outline">Button</Button>
```

## Cursor

Tailwind v4 [switched](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor) from `cursor: pointer` to `cursor: default` for the button component.

If you want to keep the `cursor: pointer` behavior, add the following code to your CSS file:

```css showLineNumbers title="globals.css"
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
```

## Examples

### Size

```tsx
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonSize() {
  return (
    <div className="flex flex-col items-start gap-8 sm:flex-row">
      <div className="flex items-start gap-2">
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button size="icon-sm" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline">Default</Button>
        <Button size="icon" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button size="icon-lg" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
    </div>
  )
}

```

```tsx
// Small
<Button size="sm" variant="outline">Small</Button>
<Button size="icon-sm" aria-label="Submit" variant="outline">
  <ArrowUpRightIcon />
</Button>

// Medium
<Button variant="outline">Default</Button>
<Button size="icon" aria-label="Submit" variant="outline">
  <ArrowUpRightIcon />
</Button>

// Large
<Button size="lg" variant="outline">Large</Button>
<Button size="icon-lg" aria-label="Submit" variant="outline">
  <ArrowUpRightIcon />
</Button>
```

### Default

```tsx
import { Button } from "@/components/ui/button"

export function ButtonDefault() {
  return <Button>Button</Button>
}

```

```tsx
<Button>Button</Button>
```

### Outline

```tsx
import { Button } from "@/components/ui/button"

export function ButtonOutline() {
  return <Button variant="outline">Outline</Button>
}

```

```tsx
<Button variant="outline">Outline</Button>
```

### Secondary

```tsx
import { Button } from "@/components/ui/button"

export function ButtonSecondary() {
  return <Button variant="secondary">Secondary</Button>
}

```

```tsx
<Button variant="secondary">Secondary</Button>
```

### Ghost

```tsx
import { Button } from "@/components/ui/button"

export function ButtonGhost() {
  return <Button variant="ghost">Ghost</Button>
}

```

```tsx
<Button variant="ghost">Ghost</Button>
```

### Destructive

```tsx
import { Button } from "@/components/ui/button"

export function ButtonDestructive() {
  return <Button variant="destructive">Destructive</Button>
}

```

```tsx
<Button variant="destructive">Destructive</Button>
```

### Link

```tsx
import { Button } from "@/components/ui/button"

export function ButtonLink() {
  return <Button variant="link">Link</Button>
}

```

```tsx
<Button variant="link">Link</Button>
```

### Icon

```tsx
import { CircleFadingArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <CircleFadingArrowUpIcon />
    </Button>
  )
}

```

```tsx showLineNumbers
<Button variant="outline" size="icon" aria-label="Submit">
  <CircleFadingArrowUpIcon />
</Button>
```

### With Icon

The spacing between the icon and the text is automatically adjusted
based on the size of the button. You do not need any margin on the icon.

```tsx
import { IconGitBranch } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconGitBranch /> New Branch
    </Button>
  )
}

```

```tsx
<Button variant="outline" size="sm">
  <IconGitBranch /> New Branch
</Button>
```

### Rounded

Use the `rounded-full` class to make the button rounded.

```tsx
import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonRounded() {
  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="icon" className="rounded-full">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}

```

```tsx
<Button variant="outline" size="icon" className="rounded-full">
  <ArrowUpRightIcon />
</Button>
```

### Spinner

```tsx
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}

```

```tsx showLineNumbers
<Button size="sm" variant="outline" disabled>
  <Spinner />
  Submit
</Button>
```

### Button Group

To create a button group, use the `ButtonGroup` component. See the [Button Group](/docs/components/button-group) documentation for more details.

```tsx
"use client"

import * as React from "react"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterPlusIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ButtonGroupDemo() {
  const [label, setLabel] = React.useState("personal")

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <MailCheckIcon />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListFilterPlusIcon />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <TagIcon />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={label}
                    onValueChange={setLabel}
                  >
                    <DropdownMenuRadioItem value="personal">
                      Personal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">
                      Work
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">
                      Other
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  )
}

```

```tsx showLineNumbers
<ButtonGroup>
  <ButtonGroup>
    <Button variant="outline" size="icon" aria-label="Go Back">
      <ArrowLeftIcon />
    </Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline">Snooze</Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="More Options">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent />
    </DropdownMenu>
  </ButtonGroup>
</ButtonGroup>
```

### Link

You can use the `asChild` prop to make another component look like a button. Here's an example of a link that looks like a button.

```tsx showLineNumbers
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function LinkAsButton() {
  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  )
}
```

## API Reference

### Button

The `Button` component is a wrapper around the `button` element that adds a variety of styles and functionality.

| Prop      | Type                                                                          | Default     |
| --------- | ----------------------------------------------------------------------------- | ----------- |
| `variant` | `"default" \| "outline" \| "ghost" \| "destructive" \| "secondary" \| "link"` | `"default"` |
| `size`    | `"default" \| "sm" \| "lg" \| "icon" \| "icon-sm" \| "icon-lg"`               | `"default"` |
| `asChild` | `boolean`                                                                     | `false`     |

## Changelog

### 2025-09-24 New sizes

We have added two new sizes to the button component: `icon-sm` and `icon-lg`. These sizes are used to create icon buttons. To add them, edit `button.tsx` and add the following code under `size` in `buttonVariants`:

```tsx showLineNumbers title="components/ui/button.tsx"
const buttonVariants = cva("...", {
  variants: {
    size: {
      // ...
      "icon-sm": "size-8",
      "icon-lg": "size-10",
      // ...
    },
  },
})
```
