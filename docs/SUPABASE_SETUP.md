# Supabase setup for Rupank Portfolio

Portfolio content (projects, skills, quest log) is stored in Supabase so every visitor sees the same data.

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Wait until the database is ready.

## 2. Run the database schema

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste the contents of `supabase/schema.sql` from this repo.
3. Click **Run**.

This creates `projects`, `skills`, `quests`, and `site_content` tables, enables Row Level Security (public read on `site_content`), and seeds default rows.

If you set up the database before `site_content` was added to `schema.sql`, run `supabase/site-content.sql` once in the SQL Editor.

Then run `supabase/resume-storage.sql` to create the public `resumes` storage bucket and seed the resume archive row. Admin uploads replace `resumes/resume.pdf` in Supabase Storage.

If Supabase shows a warning modal:

- **Run and enable RLS** — recommended (the updated `schema.sql` already defines read policies).
- **Cancel** only if you want to edit the SQL first.
- Avoid **Run without RLS** unless you know you need open tables.

The old script used `TRUNCATE`, which triggered the "destructive" warning. The current script uses safe upserts instead.

## 3. Get API keys

In **Project Settings → API**:

| Key | Env variable | Where to use |
|-----|----------------|--------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` |
| `service_role` (secret) | `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` only, never expose to the browser |

Use the **service role** key on the server only (Next.js API routes). Do not put it in `NEXT_PUBLIC_*`.

## 4. Configure `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

PROJECTS_ADMIN_KEY="your-strong-admin-password"
```

If your password contains `$`, escape it in `.env.local` with a backslash: `PROJECTS_ADMIN_KEY=456\$even` (login password is still `456$even`). Double quotes alone do not stop Next.js from expanding `$`.

Restart the dev server after changing env vars:

```bash
npm run dev
```

## 5. Deploy (Vercel, etc.)

Add the same environment variables in your hosting dashboard.

## How it works

```text
Browser → GET /api/projects (public)
Browser → POST /api/projects (admin cookie required)

API route → Supabase REST (service role)
```

- **Reads:** Anyone can load portfolio data via API.
- **Writes:** Require admin login (`PROJECTS_ADMIN_KEY`). A secure httpOnly cookie is set for 1 hour after login.

## Optional: install Supabase JS SDK

The app uses the Supabase REST API via `fetch` (no extra install required). If you prefer the official client later:

```bash
npm install @supabase/supabase-js
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Database is not configured" | Add both Supabase env vars and restart `npm run dev` |
| "Invalid access key" | `PROJECTS_ADMIN_KEY` in `.env.local` must match what you type in the modal |
| Empty sections after setup | Run `supabase/schema.sql` in the SQL editor |
| Hero/resume edits return 500 | Run `supabase/site-content.sql` (creates `site_content` table) |
| Edits not visible on another device | Confirm deploy env vars point to the same Supabase project |
| Resume upload fails | Run `supabase/resume-storage.sql` and ensure the `resumes` bucket exists |
