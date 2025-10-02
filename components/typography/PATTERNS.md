# Typography Patterns

> **Practical examples showing how to compose typography components with shadcn/ui and layout primitives**

## Basic Usage

### Page Header

```tsx
import { H1, Lead } from '@/components/typography'
import { Stack } from '@/components/layout'

export function PageHeader() {
  return (
    <Stack gap="md">
      <H1>Welcome to Your Dashboard</H1>
      <Lead>Manage your business, track appointments, and grow your revenue.</Lead>
    </Stack>
  )
}
```

### Section with Heading and Content

```tsx
import { H2, P } from '@/components/typography'
import { Stack } from '@/components/layout'

export function Section() {
  return (
    <Stack gap="md">
      <H2>About Our Services</H2>
      <P>
        We provide comprehensive salon management solutions that help you
        streamline operations and delight your customers.
      </P>
      <P>
        Our platform includes appointment scheduling, staff management,
        inventory tracking, and detailed analytics.
      </P>
    </Stack>
  )
}
```

## Card Patterns

### Simple Card with Typography

```tsx
import { H3, P, Small } from '@/components/typography'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Stack } from '@/components/layout'

export function SimpleCard() {
  return (
    <Card>
      <CardHeader>
        <H3>Premium Package</H3>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <P>Get access to all premium features including advanced analytics and priority support.</P>
          <Small className="text-muted-foreground">Starting at $99/month</Small>
        </Stack>
      </CardContent>
    </Card>
  )
}
```

### Metric Card

```tsx
import { H2, Small } from '@/components/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Stack, Flex } from '@/components/layout'
import { TrendingUp } from 'lucide-react'

export function MetricCard({ label, value, change }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Stack gap="xs">
          <Small className="text-muted-foreground">{label}</Small>
          <H2>{value}</H2>
          <Flex gap="xs" align="center">
            <TrendingUp className="h-4 w-4 text-success" />
            <Small className="text-success">+{change}%</Small>
          </Flex>
        </Stack>
      </CardContent>
    </Card>
  )
}
```

## List Patterns

### Feature List

```tsx
import { H3, P, Ul, Li } from '@/components/typography'
import { Stack } from '@/components/layout'

export function FeatureList() {
  return (
    <Stack gap="md">
      <H3>Key Features</H3>
      <Ul className="space-y-2">
        <Li>Advanced appointment scheduling with conflict detection</Li>
        <Li>Real-time staff availability tracking</Li>
        <Li>Automated customer notifications via email and SMS</Li>
        <Li>Comprehensive analytics and reporting</Li>
      </Ul>
    </Stack>
  )
}
```

### Step-by-Step Instructions

```tsx
import { H3, P, Ol, Li } from '@/components/typography'
import { Stack } from '@/components/layout'

export function Instructions() {
  return (
    <Stack gap="md">
      <H3>Getting Started</H3>
      <Ol className="space-y-3">
        <Li>
          <Strong>Create your account</Strong>
          <P className="mt-1">Sign up with your email and create a password</P>
        </Li>
        <Li>
          <Strong>Set up your salon</Strong>
          <P className="mt-1">Add your salon details, services, and staff</P>
        </Li>
        <Li>
          <Strong>Start booking</Strong>
          <P className="mt-1">Share your booking link with customers</P>
        </Li>
      </Ol>
    </Stack>
  )
}
```

## Inline Elements

### Technical Documentation

```tsx
import { H3, P, Code, Kbd } from '@/components/typography'
import { Stack } from '@/components/layout'

export function TechnicalDocs() {
  return (
    <Stack gap="md">
      <H3>API Reference</H3>
      <P>
        Use the <Code>createAppointment</Code> function to create a new appointment.
        The function accepts a configuration object and returns a Promise.
      </P>
      <P>
        Press <Kbd>Cmd</Kbd> + <Kbd>K</Kbd> to open the command palette,
        or <Kbd>Cmd</Kbd> + <Kbd>S</Kbd> to save your changes.
      </P>
    </Stack>
  )
}
```

### Emphasis and Highlighting

```tsx
import { P, Strong, Em, Mark } from '@/components/typography'

export function EmphasisExample() {
  return (
    <P>
      <Strong>Important:</Strong> <Em>Please read this carefully.</Em>
      <Mark>This section has been updated recently.</Mark>
    </P>
  )
}
```

## Alert Patterns

### Using Typography with Alerts

```tsx
import { H4, P } from '@/components/typography'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { alertVariants } from '@/lib/design-system/variants'
import { AlertCircle } from 'lucide-react'

export function CustomAlert() {
  return (
    <Alert className={alertVariants({ variant: 'warning' })}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        <H4>Attention Required</H4>
      </AlertTitle>
      <AlertDescription>
        <P>Your subscription will expire in 3 days. Please renew to continue accessing premium features.</P>
      </AlertDescription>
    </Alert>
  )
}
```

## Table Patterns

### Data Table with Typography

```tsx
import { H3, Small } from '@/components/typography'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Stack } from '@/components/layout'

export function DataTable() {
  return (
    <Stack gap="md">
      <H3>Recent Appointments</H3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>
              <Stack gap="xs">
                <span>Haircut & Style</span>
                <Small className="text-muted-foreground">with Sarah Johnson</Small>
              </Stack>
            </TableCell>
            <TableCell>
              <Small>Mar 15, 2025</Small>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  )
}
```

## Form Patterns

### Form with Typography Labels

```tsx
import { H3, P, Small } from '@/components/typography'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Stack } from '@/components/layout'

export function FormSection() {
  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <H3>Account Settings</H3>
        <P className="text-muted-foreground">
          Update your account information and preferences
        </P>
      </Stack>

      <Stack gap="md">
        <Stack gap="xs">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" />
          <Small className="text-muted-foreground">
            This is the name that will be displayed on your profile
          </Small>
        </Stack>

        <Stack gap="xs">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" />
          <Small className="text-muted-foreground">
            We'll never share your email with anyone else
          </Small>
        </Stack>
      </Stack>
    </Stack>
  )
}
```

## Dialog Patterns

### Dialog with Structured Content

```tsx
import { H2, P, Small } from '@/components/typography'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Stack } from '@/components/layout'

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <H2>Confirm Cancellation</H2>
          </DialogTitle>
          <DialogDescription>
            <Stack gap="sm">
              <P>Are you sure you want to cancel this appointment?</P>
              <Small className="text-destructive">
                This action cannot be undone. The customer will be notified.
              </Small>
            </Stack>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Keep Appointment</Button>
          <Button variant="destructive">Cancel Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Empty State Patterns

### Empty State with Typography

```tsx
import { H3, P } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Stack, Center } from '@/components/layout'
import { Calendar } from 'lucide-react'

export function EmptyState() {
  return (
    <Center className="min-h-[400px]">
      <Stack gap="md" align="center" className="text-center max-w-md">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <Stack gap="sm">
          <H3>No appointments yet</H3>
          <P className="text-muted-foreground">
            Get started by creating your first appointment or sharing your booking link with customers.
          </P>
        </Stack>
        <Button>Create Appointment</Button>
      </Stack>
    </Center>
  )
}
```

## Best Practices

### 1. **Always Use Layout Components for Spacing**

```tsx
// ✅ GOOD - Let Stack handle spacing
<Stack gap="md">
  <H2>Title</H2>
  <P>Content</P>
</Stack>

// ❌ BAD - Don't add margins directly
<>
  <H2 className="mb-4">Title</H2>
  <P>Content</P>
</>
```

### 2. **Use Semantic HTML**

```tsx
// ✅ GOOD - Use proper semantic elements
<H1>Page Title</H1>
<P>Paragraph content</P>
<Small>Helper text</Small>

// ❌ BAD - Don't use divs with classes
<div className="text-4xl font-bold">Page Title</div>
<div className="text-base">Paragraph content</div>
<div className="text-sm">Helper text</div>
```

### 3. **Customize with className**

```tsx
// ✅ GOOD - Extend with additional classes
<H2 className="text-primary">Colored Heading</H2>
<P className="max-w-prose">Constrained paragraph width</P>

// The cn() utility merges classes properly
```

### 4. **Compose Complex UIs**

```tsx
// ✅ GOOD - Build complex UIs from simple primitives
<Card>
  <CardContent className="pt-6">
    <Stack gap="md">
      <Flex justify="between" align="center">
        <H3>Section Title</H3>
        <Badge>New</Badge>
      </Flex>
      <P>Description text goes here</P>
      <Flex gap="sm">
        <Button>Primary</Button>
        <Button variant="outline">Secondary</Button>
      </Flex>
    </Stack>
  </CardContent>
</Card>
```

## Common Mistakes

### ❌ Avoid Nested Typography Components

```tsx
// ❌ BAD - Don't nest typography components
<P>
  <P>Nested paragraph</P>
</P>

// ✅ GOOD - Use Stack for multiple paragraphs
<Stack gap="md">
  <P>First paragraph</P>
  <P>Second paragraph</P>
</Stack>
```

### ❌ Don't Override Core Styles Heavily

```tsx
// ❌ BAD - Fighting against base styles
<H1 className="text-sm font-normal">This defeats the purpose</H1>

// ✅ GOOD - Use the right component for the job
<Small>Use Small for small text</Small>
```

### ❌ Don't Skip Semantic Hierarchy

```tsx
// ❌ BAD - Skipping heading levels for visual style
<H1>Page Title</H1>
<H4>Should be H2</H4>

// ✅ GOOD - Use proper hierarchy, customize visually if needed
<H1>Page Title</H1>
<H2 className="text-lg">Styled as smaller but semantically correct</H2>
```
