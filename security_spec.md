# Security Specification & Test-Driven Hardening

## 1. System Invariants & RBAC Architecture
- **Invariants**:
  1. No unauthenticated user can read or write any business collection.
  2. Any document created must have its `ownerId` match `request.auth.uid`.
  3. No user can modify or spoof another user's `ownerId` upon creation or update.
  4. Immutable fields (e.g. `ownerId`, `id`, `campaignId`) cannot be altered during updates.
  5. Audit logs are strictly append-only by verified users: no update or delete allowed.
  6. Admin privileges are verified by either the verified primary owner (`firmexpocarnival@gmail.com`) or inclusion in the `/admins/{adminId}` security roster.
  7. Every document ID must satisfy `isValidId(id)` pattern: `^[a-zA-Z0-9_\-]+$` and length <= 128.
  8. All string fields must have bounded maximum sizes to prevent Denial of Wallet memory exhaustion.

## 2. The Dirty Dozen Malicious Payloads

1. **Spoofed Owner Payload** (Identity Poisoning)
   - Collection: `/campaigns/cmp-evil`
   - Attacker Auth UID: `hacker_123`
   - Payload: `{ id: "cmp-evil", ownerId: "victim_456", name: "Hacked", objective: "brand_awareness", status: "draft" }`
   - Expected Result: `PERMISSION_DENIED` (auth.uid does not match incoming.ownerId).

2. **Junk Character Path Variable Attack** (ID Poisoning)
   - Path: `/campaigns/<2000-char-junk-string-with-emojis-and-null-bytes>`
   - Expected Result: `PERMISSION_DENIED` (`isValidId` fails).

3. **Ghost Field Injection** (Shadow Update Test)
   - Collection: `/campaigns/cmp-1`
   - Payload: `{ id: "cmp-1", ownerId: "auth_uid", name: "Valid", objective: "brand_awareness", status: "draft", __malicious_admin__: true }`
   - Expected Result: `PERMISSION_DENIED` (Strict key allowlist `hasOnly` violation).

4. **Unauthenticated Read Probe** (Blanket Read Test)
   - Request: `get(/campaigns/cmp-1)` without `request.auth`
   - Expected Result: `PERMISSION_DENIED`.

5. **Cross-Tenant List Extraction** (Query Trust Test)
   - Attacker Auth: `user_b`
   - Request: Query collection `/campaigns` where `ownerId == "user_a"`
   - Expected Result: `PERMISSION_DENIED` (Resource owner does not match `request.auth.uid`).

6. **Email Verification Bypass** (Email Spoofing Attack)
   - Attacker Auth: Email `firmexpocarnival@gmail.com`, but `email_verified: false`
   - Action: Admin write to `/admins/admin-1`
   - Expected Result: `PERMISSION_DENIED` (Requires `email_verified == true`).

7. **Audit Log Tampering / Deletion** (State Immutability)
   - Action: `delete(/auditLogs/log-123)` or `update(/auditLogs/log-123)`
   - Expected Result: `PERMISSION_DENIED` (Audit logs only permit create, never update or delete).

8. **Huge String Wallet Drain Payload** (Denial of Wallet)
   - Collection: `/campaigns/cmp-1`
   - Payload: `{ id: "cmp-1", ownerId: "auth_uid", name: "<50MB-string>", objective: "brand_awareness", status: "draft" }`
   - Expected Result: `PERMISSION_DENIED` (Exceeds `maxLength` of 200).

9. **Terminal State Regression Attack** (State Shortcutting)
   - Action: Attempt to transition campaign with `status: "archived"` back to `"draft"`.
   - Expected Result: `PERMISSION_DENIED` (Terminal state lock).

10. **Invalid Enum Objective Mutation** (Type Poisoning)
    - Payload: `{ id: "cmp-1", ownerId: "auth_uid", name: "Valid", objective: "crypto_drainer_scam", status: "draft" }`
    - Expected Result: `PERMISSION_DENIED` (Objective not in authorized enum list).

11. **Owner Reassignment Attack** (Privilege Escalation)
    - Existing: `{ id: "cmp-1", ownerId: "alice", ... }`
    - Update: `{ id: "cmp-1", ownerId: "bob", ... }`
    - Expected Result: `PERMISSION_DENIED` (`incoming().ownerId == existing().ownerId` violated).

12. **Self-Promotion to Admin** (RBAC Protection)
    - Non-admin user writes to `/admins/{their_uid}`
    - Expected Result: `PERMISSION_DENIED` (Only existing admins can write to `/admins`).
