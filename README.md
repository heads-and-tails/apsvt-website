# АПСВТ editorial website

Public multi-page website for the Academy of Labour, Social Relations and Tourism.

The Vercel `/panel` route uses Supabase Auth. New users remain pending until an administrator approves them as an editor or administrator. Approved editors can manage articles, schedules, exams, events, admissions, library content, research resources, and photographs. Row Level Security protects the database and storage bucket even if an API is called outside the interface.

The existing Sites deployment continues to use D1/R2 when Supabase variables are absent.

## Website videos

When a task requests uploading or publishing a video on the APSVT website, host the video on the configured YouTube channel and embed or link the resulting YouTube URL in the requested page. Do not store the video binary in this repository or the website's file storage. This convention also applies to website requests received by email.

The existing uploader runs on the development VM (`ubuntu-16gb-hel1-1`) at `/home/ivank/Code/youtube-uploader/uploader.py`, using `/home/ivank/Code/youtube-uploader/.venv/bin/python`. Reuse its saved Google authorization. Before uploading, run:

```bash
/home/ivank/Code/youtube-uploader/.venv/bin/python /home/ivank/Code/youtube-uploader/uploader.py status
```

Verify that the connected channel is **Ivan Kucha**, ID `UCvwT_0FbrKT88xUl4gojecA`. Read the private operational handoff at `/home/ivank/Code/apsvt-website/YOUTUBE_UPLOAD_PROMPT.txt` (also copied to `/home/ivank/Code/topology/YOUTUBE_UPLOAD_PROMPT.txt`) for upload, dry-run, and authorization renewal instructions. The handoff is kept outside version control. Never commit or print credential files or tokens.

For videos requested for publication on the public website, use **unlisted** visibility unless the request specifies public visibility. A private video may be used for staging but cannot satisfy public website publication. For uploads without website publication, retain the handoff's private default.

The user's standing instruction for all uploads is **not made for kids**: always pass `--made-for-kids no`. Do not ask for this setting again unless the user changes that instruction. Use supplied titles, descriptions, and attribution, and ask only for essential missing information.

Check upload history before retrying an interrupted upload to avoid duplicates. Verify the returned privacy status and that YouTube has finished processing and permits playback and embedding before publishing the page. After deploying the website change, verify the video link or player on the live page at desktop and mobile sizes. Uploading a video alone does not authorize unrelated website changes.

After YouTube confirms a successful upload and completed processing, verify the hosted video's identity against the upload record, then delete the local source video and temporary download or conversion copies to reclaim disk space. Retain the YouTube URL, metadata, and verification record, and continue the playback and website checks above. Keep the hosted YouTube video. Failed, incomplete, or unverified uploads retain their local files until successful hosting and processing are confirmed.

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
