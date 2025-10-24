# Fixes Checklist

## ✅ Task: SessionList Slot Cleanup
- [x] Read shadcn/ui card documentation
- [x] Remove className props from CardHeader/CardTitle/CardDescription/CardContent
- [x] Wrap layout and typography in internal divs
- [x] Verify empty and populated states render identically
- [x] Test revoke session flow
- [x] Mark complete

## ✅ Task: TimeOffRequestsClient Empty Cards
- [x] Review time-off empty and pending states
- [x] Move layout utilities from CardContent onto wrapper elements
- [x] Confirm spacing/alignment matches design
- [x] Regression test tab switching
- [x] Mark complete

## ✅ Task: StaffPageNavigation Tabs Surface
- [x] Inspect TabsList usage against shadcn pattern
- [x] Relocate background tint to a child wrapper
- [x] Verify horizontal scroll still works
- [x] Smoke test quick action buttons
- [x] Mark complete

## ✅ Task: HelpResourceBrowser TabsContent
- [x] Review tabs content structure
- [x] Remove className from TabsContent and wrap copy in `<p>` tags
- [x] Confirm typography uses default muted styles
- [x] Test tab switching for focus management
- [x] Mark complete

## ✅ Task: TeamTimeOffCalendar Empty Header
- [x] Wrap empty-state copy in a flex container inside CardHeader
- [x] Ensure alignment remains centered
- [x] Check approved requests still render correctly
- [x] Mark complete

## ✅ Task: BlockedTimesList Empty Wrapper
- [x] Move padding/alignment off CardContent
- [x] Ensure badge/status rows unaffected
- [x] Retest delete/edit flows
- [x] Mark complete

## ✅ Task: AllLocationsList Empty Wrapper
- [x] Wrap empty-state text in a padded div
- [x] Confirm list cards remain unchanged
- [x] Mark complete

## ✅ Task: ProfileClient Hero Card
- [x] Wrap hero content in an inner container for layout
- [x] Verify avatar sizing and text alignment
- [x] Retest edit tab toggle
- [x] Mark complete

## ✅ Task: MessageList Empty Header
- [x] Wrap empty-state header content for centering
- [x] Confirm message bubbles unchanged
- [x] Mark complete

## ✅ Task: MessageThreadList Empty Header
- [x] Apply wrapper-based centering
- [x] Ensure archive button still accessible
- [x] Mark complete

## ✅ Task: HelpFeedbackDrawer CardContent
- [x] Move typography and spacing classes inside CardContent
- [x] Verify checkbox layout remains stacked
- [x] Smoke test drawer open/close
- [x] Mark complete

## ✅ Task: SupportContactCard HoverCardContent
- [x] Wrap hover content in a div carrying width/text classes
- [x] Confirm hover positioning is stable
- [x] Test contact button trigger
- [x] Mark complete
