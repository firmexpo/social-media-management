# Firm Expo — Meta Graph API & DM Campaign Setup Guide

This document specifies the setup procedures, required permissions, App Review criteria, and architectural compliance rules for the **Firm Expo Instagram & Facebook DM Campaign Manager**.

---

## 1. Meta Developer App Configuration

1. Log in to [Meta for Developers](https://developers.facebook.com/).
2. Click **Create App** and select the **Business** app type.
3. Name your app (e.g. `Firm Expo Campaign Suite`) and link it to your verified Meta Business Account.
4. Add the following products to your application:
   - **Instagram Graph API**
   - **Messenger Platform**
   - **Webhooks**

---

## 2. Required Meta Permissions & App Review

To dispatch messages through official Meta APIs in production, your application must request and pass Meta App Review for the following permissions:

| Permission | Platform | Purpose | Review Justification |
| :--- | :--- | :--- | :--- |
| `instagram_manage_messages` | Instagram | Read and reply to customer-initiated direct messages within the 24-hour window. | Required for customer support follow-up and exhibition attendee badge delivery. |
| `pages_messaging` | Facebook | Send and receive Messenger customer messages for verified Page conversations. | Required for attendee inquiries, event schedule updates, and customer service. |
| `pages_manage_metadata` | Facebook | Subscribe to and process real-time page webhooks. | Ensures inbound conversations are synchronized immediately. |
| `pages_read_engagement` | Facebook | Read engagement metrics and profile display information. | Required to verify Page connection health and account ownership. |
| `business_discovery` | Instagram | Public account research for B2B partnership identification. | Discover prospective exhibition sponsors and pavilion organizers. |

> **IMPORTANT:** Firm Expo **NEVER** requests `instagram_graph_user_profile` for arbitrary followers. Under Meta Platform Terms, public followers cannot be extracted or messaged unsolicited.

---

## 3. Webhook Setup & Real-Time Verification

Configure the following endpoints in your Meta Developer App settings:

* **Callback URL**: `https://<YOUR_DOMAIN>/api/webhooks/meta`
* **Verify Token**: Configured in `.env` as `META_WEBHOOK_VERIFY_TOKEN` (default: `firmexpo_secure_webhook_token_2026`).

### Subscribed Fields:
- `messages` (inbound attendee replies and trigger keywords like `STOP`)
- `messaging_postbacks` (interactive quick-reply payload responses)
- `message_deliveries` (authoritative platform delivery receipts)

---

## 4. Architectural Feature Matrix

### Supported & Production-Ready Features
- ✅ **24-Hour Customer Care Window**: Strict pre-send validation ensuring only users with active conversations in the last 24h are messaged.
- ✅ **Global Suppression & Opt-Outs**: Automatic detection of keywords (`STOP`, `UNSUBSCRIBE`) with instant campaign suppression.
- ✅ **Multi-Step Campaign Wizard**: 6-step creation flow with live preview, variable interpolation, and safety screening.
- ✅ **Template Library**: Pre-approved message templates with dynamic placeholders (`{{firstName}}`, `{{eventName}}`, `{{registrationLink}}`).
- ✅ **Dispatch Queue Engine**: BullMQ/Redis architecture with dispatch-time eligibility re-verification and emergency pause switch.
- ✅ **Public Account Research**: Business Discovery API dossier tracker keeping research completely separate from the recipient CRM.
- ✅ **Shared Social Inbox**: Consolidated thread history with 24h timer badges and internal agent collaboration notes.
- ✅ **Audit Trail**: Immutable compliance ledger recording all eligibility checks and policy decisions.
- ✅ **Firebase Firestore Persistence**: Real-time cloud synchronization backed by Google Authentication.

### Demo-Only Simulated Features
- ⚡ **Simulated Send Responses**: When in Demo Sandbox mode, message dispatch returns simulated Meta Graph API payload IDs (`m_ig_...`) without incurring live API fees or requiring production access tokens.
- ⚡ **Mock Webhook Deliveries**: Delivery events simulate standard 200-400ms network round-trip delays.

### Unsupported & Prohibited Features (By Design)
- ❌ **Follower Scraping**: Extracting followers from public Instagram accounts is explicitly blocked.
- ❌ **Cold Mass DMs**: Initiating direct messages to users who have never contacted the business is rejected by the eligibility engine.
- ❌ **Automated Evasion**: Bypassing Meta rate limits or rotating unauthorized proxy accounts is strictly prohibited.

---

## 5. Supabase S3-Compatible Cloud Storage Setup

High-resolution exhibition media, campaign attachments, and compliance evidence documents are securely stored in the Supabase S3 Media Vault:

* **S3 Endpoint / Bucket URL**: `https://pyidhqlrxjjbjoajkqjr.storage.supabase.co/storage/v1/s3`
* **Default Bucket Name**: `firm-expo-media-vault`
* **Region**: `us-east-1`
* **API Endpoints**:
  - `GET /api/storage/config`: Retrieves active bucket configuration and validation constraints
  - `POST /api/storage/presigned-url`: Generates signed S3 upload URLs for direct client uploads
  - `POST /api/storage/upload`: Registers uploaded exhibition assets with resolution and aspect-ratio metadata
