# АПСВТ editorial website

Public multi-page website for the Academy of Labour, Social Relations and Tourism.

The Vercel `/panel` route uses Supabase Auth. New users remain pending until an administrator approves them as an editor or administrator. Approved editors can manage articles, schedules, exams, events, admissions, library content, research resources, and photographs. Row Level Security protects the database and storage bucket even if an API is called outside the interface.

The existing Sites deployment continues to use D1/R2 when Supabase variables are absent.

## Supabase setup

1. Run `supabase/migrations/202607220001_editorial_panel.sql` in the Supabase SQL editor.
2. Add the four values from `.env.example` to the Vercel project for Production, Preview, and Development.
3. In Supabase Authentication, invite the first administrator using an email listed in `EDITORIAL_ADMIN_EMAILS`.
4. Add `https://apsvt-academy-website.vercel.app/auth/callback` as an allowed redirect URL.

The service-role/secret key is server-only. Never expose it as a `NEXT_PUBLIC_` variable.

## Local development

```bash
npm run dev
```

## Validation

```bash
npx tsc --noEmit
npm run build
npm run build:vercel
```
