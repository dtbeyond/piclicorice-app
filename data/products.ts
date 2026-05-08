export type Product = {
  id: string
  name: string
  image: string
  price: string
  categories: string[]
  externalUrl: string
  approvedByAime: boolean
}

const TIKTOK_SHOP_URL = "https://vt.tiktok.com/ZTkWcTM1M/?page=TikTokShop"

export const products: Product[] = [
  {
    id: "the-ordinary-ha",
    name: "The Ordinary Hyaluronic Acid 2% + B5",
    image: "https://picsum.photos/id/1015/400/400",
    price: "$7–9",
    categories: ["hydration", "skin-barrier"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "cerave-moisturizing-cream",
    name: "CeraVe Moisturizing Cream",
    image: "https://picsum.photos/id/201/400/400",
    price: "$15–20",
    categories: ["skin-barrier", "dry-skin", "most-common"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "the-inkey-list-niacinamide",
    name: "The Inkey List Niacinamide Serum",
    image: "https://picsum.photos/id/237/400/400",
    price: "$8–12",
    categories: ["skin-barrier", "redness", "oily-skin"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "la-roche-posay-toleriane",
    name: "La Roche-Posay Toleriane Double Repair Moisturizer",
    image: "https://picsum.photos/id/251/400/400",
    price: "$20–25",
    categories: ["skin-barrier", "sensitive", "dry-skin"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "the-ordinary-vitamin-c",
    name: "The Ordinary Vitamin C Suspension 23%",
    image: "https://picsum.photos/id/1005/400/400",
    price: "$7–10",
    categories: ["glow", "sun-spots", "uneven-tone"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "differin-gel",
    name: "Differin Adapalene Gel 0.1%",
    image: "https://picsum.photos/id/1009/400/400",
    price: "$13–16",
    categories: ["anti-aging", "texture", "acne-prone"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "paulas-choice-bha",
    name: "Paula’s Choice 2% BHA Liquid Exfoliant",
    image: "https://picsum.photos/id/1016/400/400",
    price: "$30–35",
    categories: ["oily-skin", "texture", "acne-prone"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "cerave-hydrating-cleanser",
    name: "CeraVe Hydrating Facial Cleanser",
    image: "https://picsum.photos/id/160/400/400",
    price: "$12–15",
    categories: ["skin-barrier", "most-common"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "elta-md-uv-clear",
    name: "EltaMD UV Clear Broad-Spectrum SPF 46",
    image: "https://picsum.photos/id/201/400/400",
    price: "$35–40",
    categories: ["sun-spots", "glow", "most-common"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "the-ordinary-squalane",
    name: "The Ordinary 100% Plant-Derived Squalane",
    image: "https://picsum.photos/id/251/400/400",
    price: "$8–10",
    categories: ["hydration", "skin-barrier", "dry-skin"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  },
  {
    id: "azelaic-acid-the-ordinary",
    name: "The Ordinary Azelaic Acid Suspension 10%",
    image: "https://picsum.photos/id/1005/400/400",
    price: "$10–13",
    categories: ["redness", "acne-prone", "uneven-tone"],
    externalUrl: TIKTOK_SHOP_URL,
    approvedByAime: true
  }
]
