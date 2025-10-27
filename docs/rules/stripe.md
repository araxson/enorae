# Stripe Best Practices

Last updated: 2025-10-26
API version: 2025-07-30

## Checkout Sessions
- Create sessions server-side with secret keys and `mode: subscription`; pull price IDs from configuration and expand `subscription` or `line_items.data.price` on retrieval when provisioning entitlements.
- Attach metadata such as `plan_id`, `profile_id`, and marketing attribution on the Checkout Session; Stripe promotes metadata to the resulting Subscription and Customer for downstream reconciliation.
- Reuse existing Customers (`customer` param) to keep invoices and payment methods centralized; when no Customer exists supply `customer_creation: always` so Stripe drafts one linked to the email.
- Provide success URLs with `session_id={CHECKOUT_SESSION_ID}` so your callback page can retrieve the latest session, validate payment state, and surface post-purchase CTAs; cancel URLs should resume checkout with preserved selections.
- Include idempotency keys in session creation calls keyed to the authenticated user to prevent duplicate sessions if the request is retried.
- Combine recurring and one-time line items to collect setup fees or add-ons; ensure essential subscription items appear first to avoid trial misconfigurations and double-check `allow_promotion_codes` when stacking discounts.
- Use advanced options (`subscription_data[trial_end]`, `subscription_data[default_tax_rates]`, payment method types) to keep trial logic and tax selections consistent with core subscription APIs.
- Prefer `ui_mode=hosted` for PCI-leveled checkout unless the embedded experience (`ui_mode=embedded`) is required and you can meet CSP and iframe hosting guidance.

## Webhooks
- Validate every payload with `stripe.webhooks.constructEvent` (or equivalent) using the endpoint signing secret; return HTTP 400 on signature failures and log the request ID for auditability.
- Handle subscription lifecycle events explicitly: `checkout.session.completed` (hydrate user + subscription IDs), `customer.subscription.created` (seed billing state), `customer.subscription.updated` (sync plan/tax changes), `customer.subscription.deleted` (revoke access), `invoice.payment_succeeded` (extend entitlements), and `invoice.payment_failed` (trigger dunning UX).
- Persist received event IDs and guard handlers with idempotency checks so retries or manual replays never double-apply side effects.
- Short-circuit webhook logic by delegating to task queues for heavy work; Stripe expects a 2xx acknowledgement within seconds, so enqueue workflows and return early.
- Use the Stripe CLI for local testing (`stripe listen --forward-to localhost:4242/webhook`) and replay fixtures (`stripe trigger checkout.session.completed`, `stripe trigger invoice.payment_failed`); resend production events with `stripe events resend <event_id>`.
- Rotate webhook secrets when redeploying infrastructure, monitor dashboard delivery logs for failures, and enable alerting for consecutive missed attempts.

## Customer Portal
- Create billing portal sessions via `stripe.billingPortal.sessions.create`, passing the authenticated user’s Customer ID and a unique `flow_data` `after_completion` configuration when you need to redirect to guided setup flows.
- Set `return_url` to an authenticated account route (for example, `/account/billing/refresh`) that refetches the Customer and subscription to reflect edits made inside the portal before rendering UI.
- Configure allowed features in the Dashboard (plan changes, payment method management, invoice downloads, tax ID collection) so the portal mirrors your cancellation and upgrade policies; keep product copy aligned with marketing.
- Use business profile settings to surface support contact info, legal docs, and localized terms; for VAT/GST compliance enable tax ID collection and dynamic tax display.
- When offering plan switches, pair portal configuration with backend checks that reconcile `subscriptions.retrieve` responses to internal entitlements and handle proration events triggered by self-serve changes.

## Subscriptions
- Create subscriptions with explicit `customer`, `items`, `default_payment_method`, and `payment_behavior` values; include idempotency keys tied to durable order IDs to prevent duplicates under retry.
- Control proration with `proration_behavior` (`create_prorations`, `always_invoice`, `none`) and, when needed, use `billing_cycle_anchor` to align renewal dates across multi-seat accounts.
- Offer trials via `trial_period_days` or `trial_end`; if collecting payment method up front, monitor `status === incomplete` until the first invoice’s `payment_intent` succeeds and fail gracefully if authentication is required.
- For seat-based billing, update `subscription.items[i].quantity` via the API or billing portal and rely on `customer.subscription.updated` webhooks to keep seat counts synchronized.
- When canceling, choose between immediate cancellation (`cancel_now`) or `cancel_at_period_end` for access through renewal; propagate the effective end date to your entitlement service.
- Use `pending_update` and `subscription schedules` for time-bound upgrades/downgrades or migrations, reducing manual state machines.
- Persist subscription state (`status`, `current_period_start`, `current_period_end`, `collection_method`, `default_payment_method`) to drive feature gating, billing emails, and churn analytics.
- Leverage usage-based billing features (metered prices, `usage_type=metered`) by reporting usage before `invoice.upcoming`; ensure the webhook flow accounts for delayed usage adjustments.

## Prices & Products
- Treat Product and Price IDs as immutable canonical keys stored in your database; map them to internal enums and keep a changelog so historical invoices remain attributable.
- Provision both monthly and annual prices (and regional currencies) for each SKU; expose them through configuration or CMS so marketing can iterate without code deploys.
- Use Product and Price metadata (feature flags, max seat counts, `plan_code`) to keep clients lightweight and power entitlement logic after webhook events.
- Adopt `lookup_keys` to reference logical plans in APIs; rotate underlying Price IDs without shipping new code and let Checkout Sessions resolve the active price automatically.
- Archive legacy prices rather than deleting so historical receipts remain intact; record the activation window and currency in analytics to understand plan migrations.
- Keep tax behavior (`exclusive`, `inclusive`, `unspecified`), `recurring.interval`, and `collection_method` aligned across prices to avoid invoice surprises; tie prices to automated tax or Avalara settings where applicable.

## Error Handling
- Handle API errors by inspecting HTTP status and `error.type`; retry safely idempotent operations (409 conflict, 429 rate limit, 5xx) with exponential backoff and surface the Stripe `request-id` in logs for support escalation.
- Guard Checkout and subscription mutations with graceful fallbacks: if session creation fails, show recovery UI; if subscription updates return `card_error`, prompt the user to update payment details.
- For payment failures, rely on Smart Retries or custom `collection_method=charge_automatically` retry rules; send immediate notifications and link to the Customer Portal so users can update payment methods.
- Treat `invoice.payment_failed` and `customer.subscription.updated` events as system of record for dunning. Pause entitlements only after Stripe exhausts retries or the subscription transitions to `past_due`/`canceled`.
- Maintain a dead-letter queue for webhook processing; store event payloads, IDs, and customer references so failures can be replayed safely.
- Periodically review Stripe Radar alerts, disputes, and webhook delivery logs to catch systemic issues; update alerts when payment failure rates exceed thresholds.
