export type TikTokLink = {
  id: string
  label: string
  url: string
  description: string
  isFeatured: boolean
}

export type SocialLink = {
  id: "tiktok" | "instagram" | "facebook"
  label: string
  handle: string
  url: string
  description: string
  isEnabled: boolean
}

export type SiteContent = {
  shopUrl: string
  homepageVideoUrl: string
  homepageImageUrl: string
  homepageImagePosition: string
  finestVideoUrl: string
  finestImageUrl: string
  finestImagePosition: string
  shopImagePosition: string
  routineImagePosition: string
  contactHeadline: string
  contactBody: string
  contactTikTokProfileUrl: string
  contactTikTokProfileImageUrl: string
  disclosureText: string
  socialLinks: SocialLink[]
  tiktokLinks: TikTokLink[]
}

export const SITE_CONTENT_ID = "piclicorice-public-content"
export const SITE_CONTENT_STORAGE_KEY = "piclicorice_site_content"

export const defaultSiteContent: SiteContent = {
  shopUrl: "https://vt.tiktok.com/ZTkWcTM1M/?page=TikTokShop",
  homepageVideoUrl: "",
  homepageImageUrl: "/assets/piclicorice/piclicorice_home_hero_watch_aime_first_v2_16x10.png",
  homepageImagePosition: "center center",
  finestVideoUrl: "",
  finestImageUrl: "/assets/piclicorice/piclicorice_home_finest_at_50_v2_16x9.png",
  finestImagePosition: "center center",
  shopImagePosition: "center center",
  routineImagePosition: "center center",
  contactHeadline: "Need help from Aime?",
  contactBody:
    "Contact details are coming in the next content pass. For launch, use this page as the calm home for support notes, business contact, and disclosures.",
  contactTikTokProfileUrl: "https://www.tiktok.com/@pic_licorice",
  contactTikTokProfileImageUrl: "",
  disclosureText:
    "PicLicorice is educational skincare guidance, not medical advice. Some shop links may be affiliate links. You pay the same, and PicLicorice may earn a small commission.",
  socialLinks: [
    {
      id: "tiktok",
      label: "TikTok",
      handle: "@pic_licorice",
      url: "https://www.tiktok.com/@pic_licorice",
      description: "Skin, aging, routine guidance, and product updates.",
      isEnabled: true,
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@the_livefactory",
      url: "https://www.instagram.com/the_livefactory?igsh=NTc4MTlwNjQ2YQ%3D%3D&utm_source=qr",
      description: "Behind the scenes, brand updates, and Live Factory work.",
      isEnabled: true,
    },
    {
      id: "facebook",
      label: "Facebook",
      handle: "Coming soon",
      url: "",
      description: "Facebook page will be added when the link is ready.",
      isEnabled: false,
    },
  ],
  tiktokLinks: [
    {
      id: "showcase",
      label: "Aime's TikTok Showcase",
      url: "https://vt.tiktok.com/ZTkWcTM1M/?page=TikTokShop",
      description: "Current shop/showcase link for @pic_licorice.",
      isFeatured: true,
    },
  ],
}

export function normalizeSiteContent(content: Partial<SiteContent> | null | undefined): SiteContent {
  const mergedContent = {
    ...defaultSiteContent,
    ...(content || {}),
    homepageImageUrl: content?.homepageImageUrl || defaultSiteContent.homepageImageUrl,
    finestImageUrl: content?.finestImageUrl || defaultSiteContent.finestImageUrl,
    homepageImagePosition: content?.homepageImagePosition || defaultSiteContent.homepageImagePosition,
    finestImagePosition: content?.finestImagePosition || defaultSiteContent.finestImagePosition,
    shopImagePosition: content?.shopImagePosition || defaultSiteContent.shopImagePosition,
    routineImagePosition: content?.routineImagePosition || defaultSiteContent.routineImagePosition,
    contactTikTokProfileImageUrl:
      content?.contactTikTokProfileImageUrl || defaultSiteContent.contactTikTokProfileImageUrl,
  }

  return {
    ...mergedContent,
    socialLinks:
      content?.socialLinks?.map((link) => ({
        id: link.id,
        label: link.label || link.id,
        handle: link.handle || "",
        url: link.url || "",
        description: link.description || "",
        isEnabled: Boolean(link.isEnabled),
      })) || defaultSiteContent.socialLinks,
    tiktokLinks:
      content?.tiktokLinks?.map((link) => ({
        id: link.id || crypto.randomUUID(),
        label: link.label || "TikTok link",
        url: link.url || "",
        description: link.description || "",
        isFeatured: Boolean(link.isFeatured),
      })) || defaultSiteContent.tiktokLinks,
  }
}
