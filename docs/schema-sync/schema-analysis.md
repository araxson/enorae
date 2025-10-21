# Schema Sync Notes (2025-10-20)

Source of truth: Supabase project `nwmcpfioxerzodvbjigw`.

## organization.salon_chains (table)
- **Columns:** `id`, `name`, `slug`, `owner_id`, `legal_name`, `headquarters_address`, `is_active`, `is_verified`, `verified_at`, `created_at`, `updated_at`, `deleted_at`, `deleted_by_id`, `created_by_id`, `updated_by_id`, `logo_url`, `brand_colors`, `brand_guidelines`, `website`, `corporate_email`, `corporate_phone`, `billing_email`, `metrics_calculated_at`, `subscription_tier`, `settings`, `features`.
- **Code expectations:** Admin chain mutations read & update `is_active`, `deleted_at`, `subscription_tier`.
- **Gap:** Current code reads/updates via `salon_chains_view`, causing type errors and attempting to mutate a view.

## public.salon_chains_view (view)
- **Columns:** `id`, `name`, `slug`, `legal_name`, `is_active`, `is_verified`, `rating_average`, `rating_count`, `salon_count`, `staff_count`, `subscription_tier`, `total_completed_appointments`, `total_revenue`, `created_at`, `updated_at`.
- **Code expectations:** Selects `deleted_at` and uses view for `UPDATE`.
- **Gap:** View does **not** expose `deleted_at`; it is read-only. Updates must target `organization.salon_chains`.

## engagement.salon_reviews (table)
- **Columns:** `id`, `salon_id`, `customer_id`, `appointment_id`, `rating`, `title`, `comment`, `service_quality_rating`, `cleanliness_rating`, `value_rating`, `response`, `response_date`, `responded_by_id`, `is_verified`, `is_featured`, `is_flagged`, `flagged_reason`, `created_at`, `updated_at`, `deleted_at`, `deleted_by_id`.
- **Code expectations:** Admin moderation mutations update `is_flagged`, `flagged_reason`, `is_verified`, `deleted_at` via `salon_reviews_view`.
- **Gap:** View omits `flagged_reason`, `deleted_at`; writes must go to `engagement.salon_reviews`.

## public.salon_reviews_view (view)
- **Columns:** `id`, `salon_id`, `salon_name`, `customer_id`, `customer_name`, `staff_id`, `staff_name`, `rating`, `comment`, `is_flagged`, `is_verified`, `helpful_count`, `created_at`, `updated_at`.
- **Code expectations:** Requires `flagged_reason`, `deleted_at`, `response` etc.
- **Gap:** Non-existent columns; add secondary fetch or join when metadata needed.

## scheduling.time_off_requests (table)
- **Columns:** `id`, `staff_id`, `salon_id`, `start_at`, `end_at`, `reason`, `request_type`, `status`, `created_at`, `updated_at`, `deleted_at`, `deleted_by_id`, `created_by_id`, `updated_by_id`, `reviewed_by_id`, `reviewed_at`, `review_notes`, `is_notify_customers`, `is_auto_reschedule`.
- **Code expectations:** Staff time-off modules update and read advanced fields via `time_off_requests_view`.
- **Gap:** View is for reads only; mutations must target table.

## public.time_off_requests_view (view)
- **Columns:** `id`, `salon_id`, `salon_name`, `salon_slug`, `staff_id`, `staff_name`, `staff_title`, `staff_user_id`, `start_at`, `end_at`, `duration_days`, `status`, `request_type`, `reason`, `review_notes`, `reviewed_by_id`, `reviewed_by_name`, `reviewed_at`, `is_notify_customers`, `is_auto_reschedule`, `created_at`, `updated_at`.
- **Code expectations:** Attempts to `insert/update` via view.
- **Gap:** View is read-only; limit usage to selects.

## public.salons (view)
- **Columns:** `id`, `name`, `slug`, `short_description`, `full_description`, `address`, `street_address`, `street_address_2`, `city`, `state_province`, `postal_code`, `country_code`, `formatted_address`, `latitude`, `longitude`, `website_url`, `primary_phone`, `primary_email`, `is_active`, `is_accepting_bookings`, `is_featured`, `is_verified`, `rating_average`, `rating_count`, `created_at`.
- **Code expectations:** Customer/marketing features expect `amenities`, `specialties`, `languages`, `hours_display_text`, `gallery_urls`, `features`.
- **Gap:** These come from other tables (`salon_amenities`, `salon_languages`, `salon_contact_details`, `salon_media`, `salon_settings`). Need explicit joins/transformations.

## public.salon_media_view (view)
- **Columns:** `salon_id`, `salon_name`, `salon_slug`, `business_name`, `logo_url`, `cover_image_url`, `gallery_urls`, `gallery_image_count`, `brand_colors`, `social_links`, `created_at`, `updated_at`.
- **Code expectations:** Already aligns; use for media assets instead of assuming fields on `salons`.

## public.service_pricing_view (view)
- **Columns:** `id`, `service_id`, `salon_id`, `service_name`, `service_description`, `base_price`, `sale_price`, `current_price`, `currency_code`, `commission_rate`, `cost`, `profit_margin`, `tax_rate`, `is_taxable`, `created_at`, `updated_at`, `created_by_id`, `updated_by_id`, `deleted_at`, `deleted_by_id`.
- **Code expectations:** Matches; ensure queries reference this view for pricing data.

## public.staff (view)
- **Columns:** `id`, `user_id`, `salon_id`, `salon_name`, `salon_slug`, `full_name`, `email`, `title`, `bio`, `experience_years`, `services_count`, `total_appointments`, `status`, `avatar_url`, `avatar_thumbnail_url`, `business_name`, `created_at`, `updated_at`, `deleted_at`, `deleted_by_id`.
- **Code expectations:** Some components expect `specialties`, `languages`, `rating`.
- **Gap:** Additional attributes require joins to `staff_services`, `salon_specialties`, etc.

## public.appointments (view)
- **Columns:** `id`, `salon_id`, `salon_name`, `service_id`, `service_name`, `service_names`, `customer_id`, `customer_name`, `customer_email`, `staff_id`, `staff_name`, `start_time`, `end_time`, `duration_minutes`, `status`, `confirmation_code`, `total_price`, `created_at`, `updated_at`, `completed_at`, `cancelled_at`.
- **Code expectations:** Some modules expect `notes`, `staff_avatar`, arrays typed as `string` fields; split/computed as needed.

---

Use this sheet while refactoring queries/components. Add new entries if additional tables or views surface during fixes.
