# Local Development & Prisma Guide

This project is a **Vite + React (Frontend) + Express (Backend) application** with **Prisma ORM** for PostgreSQL data modeling and **Firebase** for cloud authentication & persistence.

---

## 1. Why Did `bunx prisma dev module.ts` Fail?

If you saw this error:
```
✘ [CONFIG.FILE_MISSING] No prisma-composer.config.{ts,mts,mjs,js} found
✘ [CLI.CREDENTIALS_REQUIRED] You must be signed in to run this command.
```

### The Reason:
- In Prisma 8 (`prisma@8.0.0-rc.17`), Prisma introduced the **Prisma Developer Platform & Prisma Composer**.
- The commands `prisma dev <entry>` and `prisma deploy <entry>` are specifically designed for deploying and running containerized services on the **Prisma Cloud Platform**. They require a Prisma Cloud account (`prisma auth login`) and a `prisma-composer.config.ts` configuration file.
- **This application is NOT a Prisma Composer deployment.** It is a standard Vite + React + Express application with Prisma ORM (`prisma/schema.prisma`).

---

## 2. How to Run This Application Locally

### Step 1: Install Dependencies
```bash
bun install
# or
npm install
```

### Step 2: Start the Development Server
To run the full app locally:
```bash
bun run dev
# or
npm run dev
```
> The application will start at `http://localhost:3000`.

To run with the Express backend server (which mounts Vite middleware and handles `/api/*` routes):
```bash
bun run server
# or
npm run server
```

---

## 3. How to Use Prisma in this Project

This project includes a complete PostgreSQL schema in `prisma/schema.prisma` covering:
- Workspaces & Multi-tenancy
- Social Accounts & OAuth credentials
- Campaigns & Posts
- Contacts & 24h Customer Care compliance
- Message Templates & Scheduled Dispatch Jobs

### Database Commands (using Bun or npm):

1. **Generate the Prisma Client**:
   ```bash
   bun run db:generate
   # or
   bunx prisma generate
   ```

2. **Sync the Schema to your PostgreSQL Database**:
   Set `DATABASE_URL` in your `.env` file, then run:
   ```bash
   bun run db:push
   # or
   bunx prisma db push
   ```

3. **Open Prisma Studio (Visual Database GUI)**:
   ```bash
   bun run db:studio
   # or
   bunx prisma studio
   ```

4. **Run Migrations (Production workflow)**:
   ```bash
   bunx prisma migrate dev --name init
   ```

---

## 4. Using Prisma Client in Code

A pre-configured singleton Prisma Client is available at `src/server/db.ts`:

```typescript
import { prisma } from './src/server/db';

// Example: Fetch campaigns
const campaigns = await prisma.campaign.findMany({
  where: { status: 'PUBLISHED' },
  include: { posts: true }
});
```

---

## 5. Storage / S3 Bucket Configuration

The Supabase S3-compatible media vault endpoint is configured in `.env`:
```env
S3_ENDPOINT="https://pyidhqlrxjjbjoajkqjr.storage.supabase.co/storage/v1/s3"
S3_BUCKET_NAME="firm-expo-media-vault"
```
You can test and view bucket status in the app under **Settings -> S3 Storage Vault** or in the **Media Library**.
