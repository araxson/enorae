# 16: Accessibility Issues

**Role:** Accessibility Auditor

## Objective

Identify accessibility violations including missing ARIA labels, poor keyboard navigation, missing alt text, semantic HTML issues, and components that are difficult for assistive technologies to use.

## What to Search For

- Missing ARIA labels and roles
- Images without alt text
- Missing form labels
- Poor keyboard navigation (no tabindex, no focus handling)
- Semantic HTML violations (div instead of button, span instead of label)
- Missing aria-label on icon-only buttons
- Color contrast issues (in CSS)
- Missing skip navigation links
- Inaccessible modals/dialogs
- Missing aria-describedby or aria-labelledby

## How to Identify Issues

1. **Find images** without alt attributes
2. **Search for buttons/links** without accessible names
3. **Identify icon-only buttons** without aria-label
4. **Check forms** for missing labels
5. **Find divs/spans** used as interactive elements

## Example Problems

```tsx
// ❌ Image without alt text
<img src="/salon-photo.jpg" />

// ❌ Icon-only button without label
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// ❌ Missing form label
<div>
  <input type="email" placeholder="Email" />
</div>

// ❌ Div used as button
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>

// ❌ Missing aria-label on interactive element
<a href="/logout">
  <LogoutIcon />
</a>

// ❌ Poor semantic HTML
<span onClick={submit} style={{ cursor: 'pointer' }}>
  Submit Form
</span>
```

## Fix Approach

- Add alt text to all images
- Add aria-label to icon-only buttons
- Use semantic HTML (button, a, label, etc.)
- Add proper form labels
- Implement keyboard navigation (Tab, Enter, Escape)
- Add focus management for modals
- Use aria-describedby for complex inputs
- Add aria-live for dynamic content
- Prefer shadcn/ui primitives for buttons, links, dialogs, and form controls to inherit accessible structure
- Review `docs/stack-patterns/ui-patterns.md` for shadcn accessibility guidance

## Output Format

List findings as:
```
- HIGH: features/customer/discovery/components/salon-gallery.tsx:45 - Image missing alt text
- HIGH: features/business/appointments/components/action-buttons.tsx:23 - Icon-only button missing aria-label
- MEDIUM: features/staff/profile/components/profile-form.tsx:12 - Form input missing label
```

## Stack Pattern Reference

Review:
- `docs/stack-patterns/ui-patterns.md`
- `docs/stack-patterns/react-patterns.md`

Complete accessibility audit and report all violations.
