# Layout Component System

A modern, flexible, and reusable layout component system for Next.js applications with shadcn/ui and Tailwind CSS.

## 🎯 Philosophy

This layout system follows these core principles:

1. **Composability**: Small, focused components that combine well
2. **Consistency**: Predictable spacing, sizing, and behavior
3. **Responsiveness**: First-class support for responsive design
4. **Type Safety**: Full TypeScript support with excellent DX
5. **Accessibility**: Semantic HTML and ARIA attributes where needed

## 📦 Components

### Core Primitives

#### `<Box />`
The foundation component providing spacing, display, and positioning control.

```tsx
<Box p="md" m="lg" display="flex" position="relative">
  Content with padding and margin
</Box>

// Responsive values
<Box p={{ base: 'sm', md: 'md', lg: 'lg' }}>
  Responsive padding
</Box>
```

#### `<Container />`
Centers content with max-width constraints and consistent padding.

```tsx
<Container size="lg">
  Centered content with max-width
</Container>

<Container size="xl" noPadding>
  Full-width content without padding
</Container>
```

#### `<Section />`
Semantic sectioning with vertical rhythm and optional container.

```tsx
<Section size="lg">
  Automatically wrapped in Container
</Section>

<Section size="xl" fullWidth>
  Full-width section without container
</Section>
```

#### `<Spacer />`
Creates consistent spacing between elements.

```tsx
<Stack>
  <Text>First item</Text>
  <Spacer size="lg" />
  <Text>Second item with space</Text>
</Stack>
```

### Flexbox Components

#### `<Flex />`
Full flexbox control with responsive properties.

```tsx
<Flex direction="row" align="center" justify="between" gap="md">
  <div>Left</div>
  <div>Right</div>
</Flex>

// Responsive direction
<Flex direction={{ base: 'col', md: 'row' }} gap="lg">
  <div>Stacked on mobile</div>
  <div>Side-by-side on desktop</div>
</Flex>
```

#### `<Stack />`
Vertical stacking of elements (flex-col).

```tsx
<Stack gap="md" align="stretch">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Stack>
```

#### `<Group />`
Horizontal grouping with wrapping (perfect for tags, buttons).

```tsx
<Group gap="sm">
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>Next.js</Badge>
</Group>
```

### Grid Components

#### `<Grid />`
CSS Grid with responsive columns and auto-fit/auto-fill support.

```tsx
// Fixed columns
<Grid cols={3} gap="md">
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</Grid>

// Responsive columns
<Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
  <Card>Responsive</Card>
  <Card>Grid</Card>
  <Card>Layout</Card>
</Grid>

// Auto-fit grid
<Grid autoFit minChildWidth="250px" gap="md">
  <Card>Auto</Card>
  <Card>Fit</Card>
  <Card>Grid</Card>
</Grid>
```

### Utility Components

#### `<Center />`
Centers content horizontally and/or vertically.

```tsx
<Center className="h-screen">
  <div>Centered content</div>
</Center>

<Center axis="horizontal">
  <div>Only horizontally centered</div>
</Center>
```

#### `<Divider />`
Visual separator with optional label.

```tsx
<Divider />

<Divider label="OR" spacing="lg" />

<Flex>
  <div>Left</div>
  <Divider orientation="vertical" />
  <div>Right</div>
</Flex>
```

#### `<VisuallyHidden />`
Hides content visually but keeps it accessible to screen readers.

```tsx
<button>
  <Icon />
  <VisuallyHidden>Close dialog</VisuallyHidden>
</button>
```

## 🎨 Spacing System

All spacing props use a consistent scale:

- `none`: 0
- `xs`: 0.5rem (8px)
- `sm`: 1rem (16px)
- `md`: 1.5rem (24px)
- `lg`: 2rem (32px)
- `xl`: 2.5rem (40px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)

## 📱 Responsive Values

Most layout props support responsive values:

```tsx
// Single value (applies to all breakpoints)
<Box p="md" />

// Responsive object
<Box p={{ base: 'sm', md: 'md', lg: 'lg' }} />

// Breakpoints:
// base: 0px
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

## 💡 Common Patterns

### Page Layout
```tsx
<Section size="lg">
  <Stack gap="xl">
    <Box>
      <H1>Page Title</H1>
      <P>Description</P>
    </Box>
    <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
      {/* Content */}
    </Grid>
  </Stack>
</Section>
```

### Card Layout
```tsx
<Box p="md" className="border rounded-lg">
  <Stack gap="sm">
    <H3>Card Title</H3>
    <Divider />
    <P>Card content goes here</P>
    <Group gap="sm">
      <Button>Action</Button>
      <Button variant="outline">Cancel</Button>
    </Group>
  </Stack>
</Box>
```

### Hero Section
```tsx
<Section size="xl" className="bg-gradient-to-b from-primary/10">
  <Center className="min-h-[60vh]">
    <Stack gap="lg" align="center">
      <H1 className="text-5xl">Welcome</H1>
      <P className="text-xl">Build amazing layouts</P>
      <Group>
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </Group>
    </Stack>
  </Center>
</Section>
```

### Form Layout
```tsx
<Container size="sm">
  <Stack gap="md" as="form">
    <Box>
      <Label>Name</Label>
      <Input />
    </Box>
    <Box>
      <Label>Email</Label>
      <Input type="email" />
    </Box>
    <Divider />
    <Flex justify="end" gap="sm">
      <Button variant="outline">Cancel</Button>
      <Button type="submit">Submit</Button>
    </Flex>
  </Stack>
</Container>
```

## 🚀 Best Practices

1. **Start with Section/Container**: Most pages should start with these
2. **Use Stack for vertical layouts**: Better than manual spacing
3. **Use Grid for 2D layouts**: More powerful than nested Flex
4. **Leverage responsive values**: Design mobile-first
5. **Consistent spacing**: Use the spacing scale, not arbitrary values
6. **Semantic HTML**: Use appropriate `as` props when needed

## 🔧 Integration with shadcn/ui

This layout system works seamlessly with shadcn/ui components:

```tsx
import { Button, Card, Input } from '@/components/ui'
import { Section, Container, Stack, Grid } from '@/components/layout'

<Section>
  <Stack gap="lg">
    <Card>
      <Stack gap="md" className="p-6">
        <Input placeholder="Search..." />
        <Button>Submit</Button>
      </Stack>
    </Card>
  </Stack>
</Section>
```

## 📝 TypeScript

Full TypeScript support with autocomplete for all props:

```tsx
import type { BoxProps, FlexProps, GridProps } from '@/components/layout'

const MyComponent: React.FC<BoxProps> = (props) => {
  return <Box {...props} />
}
```

## 🎯 Migration Guide

If migrating from inline Tailwind classes:

```tsx
// Before
<div className="px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
  <div className="mx-auto max-w-7xl">
    <div className="flex flex-col gap-6">
      {/* Content */}
    </div>
  </div>
</div>

// After
<Section size="lg">
  <Stack gap="md">
    {/* Content */}
  </Stack>
</Section>
```

## 🤝 Contributing

When adding new layout components:

1. Follow the existing patterns
2. Support responsive values where appropriate
3. Include TypeScript types
4. Add to the barrel export
5. Update this documentation

---

Built with ❤️ for modern Next.js applications