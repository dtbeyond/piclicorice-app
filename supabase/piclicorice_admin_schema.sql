create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;

create policy "site content is public readable"
on public.site_content
for select
using (true);

create policy "admin users can read their own admin row"
on public.admin_users
for select
to authenticated
using (email = auth.jwt() ->> 'email');

create policy "admins can insert site content"
on public.site_content
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

create policy "admins can update site content"
on public.site_content
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

insert into public.site_content (id, content)
values (
  'piclicorice-public-content',
  '{
    "shopUrl": "https://vt.tiktok.com/ZTkWcTM1M/?page=TikTokShop",
    "homepageVideoUrl": "",
    "homepageImageUrl": "",
    "finestVideoUrl": "",
    "finestImageUrl": "",
    "contactHeadline": "Need help from Aime?",
    "contactBody": "Contact details are coming in the next content pass. For launch, use this page as the calm home for support notes, business contact, and disclosures.",
    "contactTikTokProfileUrl": "https://www.tiktok.com/@pic_licorice",
    "contactTikTokProfileImageUrl": "",
    "disclosureText": "PicLicorice is educational skincare guidance, not medical advice. Some shop links may be affiliate links. You pay the same, and PicLicorice may earn a small commission.",
    "socialLinks": [
      {
        "id": "tiktok",
        "label": "TikTok",
        "handle": "@pic_licorice",
        "url": "https://www.tiktok.com/@pic_licorice",
        "description": "Skin, aging, routine guidance, and product updates.",
        "isEnabled": true
      },
      {
        "id": "instagram",
        "label": "Instagram",
        "handle": "@the_livefactory",
        "url": "https://www.instagram.com/the_livefactory?igsh=NTc4MTlwNjQ2YQ%3D%3D&utm_source=qr",
        "description": "Behind the scenes, brand updates, and Live Factory work.",
        "isEnabled": true
      },
      {
        "id": "facebook",
        "label": "Facebook",
        "handle": "Coming soon",
        "url": "",
        "description": "Facebook page will be added when the link is ready.",
        "isEnabled": false
      }
    ],
    "tiktokLinks": [
      {
        "id": "showcase",
        "label": "Aime''s TikTok Showcase",
        "url": "https://vt.tiktok.com/ZTkWcTM1M/?page=TikTokShop",
        "description": "Current shop/showcase link for @pic_licorice.",
        "isFeatured": true
      }
    ]
  }'::jsonb
)
on conflict (id) do nothing;

-- After creating Aime's Supabase Auth user, run:
-- insert into public.admin_users (email) values ('aime@example.com')
-- on conflict (email) do nothing;

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "site media is public readable"
on storage.objects
for select
using (bucket_id = 'site-media');

create policy "admins can upload site media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);

create policy "admins can update site media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-media'
  and exists (
    select 1
    from public.admin_users
    where email = auth.jwt() ->> 'email'
  )
);
