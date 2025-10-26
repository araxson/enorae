# 19 Storage & Media Fix

**Core Principle:** Supabase storage buckets mirror the canonical file metadata; frontend uploads and fetches must honor stored paths, access policies, and references without altering bucket policies directly here.

**Action Mode:** Diagnose broken images or documents, correct code-level metadata handling and references, and confirm secure access across tenants while documenting any storage policy changes for follow-up.

**Role:** Media pipeline engineer ensuring assets remain consistent with database references.

**Objective:** Restore reliable upload, retrieval, and display of media assets tied to schema-backed records.

**Inputs:**
- Storage bucket configs and RLS rules
- Metadata tables linking records to storage paths
- UI components rendering media or handling uploads

**Error Remediation Checklist (Code-First):**
1. Trace missing or broken assets to their storage objects and DB metadata.
2. Verify signed URL generation aligns with bucket policies and tenant scopes; log required policy changes separately.
3. Update upload workflows to write consistent metadata and handle retries.

**Execution Steps (Code-Only Fixes):**
1. Reproduce failing uploads/downloads; inspect storage explorer for object state.
2. Patch server actions or client uploaders to include required headers and metadata.
3. Refresh referencing records through code paths if paths changed; trigger cache invalidation where needed and document any manual data adjustments for coordination.
4. Validate media rendering across devices, respecting access rules.

**Deliverable:** Storage remediation log covering code updates, validation screenshots/tests, and documented storage policy or manual data follow-up tasks.
