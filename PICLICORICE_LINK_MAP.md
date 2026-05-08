# PicLicorice Link Map

This map is ordered the way a user experiences the site: nav left to right, then homepage top to bottom.

## Bottom Navigation

1. Home -> `/`
2. Routine -> `/routine`
3. Finest -> `/formula`
4. Shop -> `/shop`
5. Contact -> `/contact`

## Homepage

Top bar:
- PicLicorice brand: visual only
- SHOP NOW -> `/shop`

Hero / intro:
- Aime intro video card -> opens local video preview modal

Primary buttons:
- Fix My Routine -> `/routine`
- Finest at 50 -> `/formula`
- Shop Now -> `/shop`

Feature banner:
- Finest at 50 Method banner -> `/formula`

Featured TikTok links:
- Each card -> external public TikTok URL saved in `/admin`
- These links are content cards only. They are not tied to main site buttons.

Welcome Back card:
- View My Routine -> `/routine`
- Start Fresh -> clears saved local routine data

Concern chips:
- Dry skin -> `/routine?concern=dryness`
- Oily skin -> `/routine?concern=oiliness`
- Redness -> `/routine?concern=redness`
- Wrinkles -> `/routine?concern=wrinkles`
- Uneven tone -> `/routine?concern=uneven-tone`

Newsletter modal:
- Get Weekly Fixes -> closes modal for now
- Not Now -> closes modal

## Shop Page

Primary button:
- Ask Aime First -> `/contact`

Secondary external link:
- Open TikTok Showcase -> external URL saved in `/admin`

Bottom nav:
- Same five public sections as above.

## Contact Page

Social links:
- TikTok -> `https://www.tiktok.com/@pic_licorice`
- Instagram -> `https://www.instagram.com/the_livefactory?igsh=NTc4MTlwNjQ2YQ%3D%3D&utm_source=qr`
- Facebook -> stubbed/disabled until the page URL is ready
- Managed in `/admin` under Social links.
- TikTok uses `Media 5: Contact TikTok profile picture` as its avatar when uploaded.

## Aime Dashboard

Header/side navigation:
- Home -> `/`
- Routine -> `/routine`
- Finest -> `/formula`
- Shop -> `/shop`
- Contact -> `/contact`

Editable external content:
- TikTok Shop / Showcase URL
- Featured TikTok links
- Media URLs/uploads

These editable links are content destinations. Main site buttons stay routed to internal site sections.

## Numbered Media Slots

Media 1: Homepage intro video
- Appears at the top of the homepage.
- Plays in place.
- Best as a short direct upload from Aime.

Media 2: Homepage feature image
- Appears below the homepage intro video.
- Visual only for now.
- Best as a direct image upload.

Media 3: Finest at 50 video
- Appears at the top of the Finest at 50 Method page.
- Plays in place.
- Best as direct upload for short clips or YouTube/Vimeo for longer videos.

Media 4: Finest at 50 banner image
- Appears on the Finest at 50 Method page.
- Visual only for now.
- Best as a direct image upload.

Media 5: Contact TikTok profile picture
- Appears inside the Contact page TikTok profile card.
- Visual only. The card button opens the TikTok profile.
- Best as the PicLicorice profile image or Aime's preferred brand photo.

Media 6+: Featured TikTok links
- Appear as content cards on the homepage.
- Each card opens the saved external TikTok URL.
- These are not tied to main site buttons.

## Admin-Only Stubs

Live Factory Command:
- Dashboard link -> `/admin/live-factory`
- Not shown in public navigation.
- Stubbed for now as an admin-only command workspace.
