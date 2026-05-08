# Aime Admin Setup

The site now has an admin dashboard at:

`/admin`

## What Aime Needs To Do

1. Give Davin the public TikTok links she wants on the site:
   - TikTok Shop / Showcase link
   - Featured TikTok video links
   - Any profile links she wants shown

2. Use the admin dashboard to update:
   - Shop / Showcase URL
   - Featured TikTok links
   - Homepage image or video
   - Finest at 50 image or video
   - Contact copy
   - Disclosure copy

3. She does not need a TikTok API account for this version.

## What Davin Needs To Do Once

1. Open Supabase for the PicLicorice project.
2. Run `supabase/piclicorice_admin_schema.sql` in the SQL editor.
3. Create Aime as a Supabase Auth user.
4. Add her email to `admin_users`:

```sql
insert into public.admin_users (email)
values ('aime@example.com')
on conflict (email) do nothing;
```

Replace `aime@example.com` with her real login email.

## TikTok API Decision

No TikTok API is needed for launch. Public links are enough.

Use the TikTok API only later if the site needs to automatically pull new posts from `@pic_licorice`.
