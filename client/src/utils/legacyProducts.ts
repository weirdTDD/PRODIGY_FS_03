import dataProduct from "../Assets/data";
import newCollections from "../Assets/new_collections";
import { Product } from "../types";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const toLegacyProduct = (item: {
  id: number;
  name: string;
  image: string;
  new_price: number;
  old_price?: number;
}): Product => {
  const slug = `${slugify(item.name)}-${item.id}`;

  return {
    _id: `legacy-${item.id}`,
    name: item.name,
    slug,
    description:
      "Curated thrift piece from our legacy collection. Details will be updated soon.",
    price: item.new_price,
    category: "legacy",
    images: [item.image],
    stock: 12,
    condition: "good",
    size: "One Size",
    color: "",
    material: "",
    isFeatured: false,
    isAvailable: true,
    ratings: 4.3,
    numReviews: 0,
    views: 0,
    sold: 0,
    reviews: [],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString()
  };
};

export const mapLegacyItems = (items: Array<{
  id: number;
  name: string;
  image: string;
  new_price: number;
  old_price?: number;
}>) => items.map((item) => toLegacyProduct(item));

const mergeLegacy = () => {
  const map = new Map<number, Product>();
  [...dataProduct, ...newCollections].forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, toLegacyProduct(item));
    }
  });
  return Array.from(map.values());
};

export const legacyProducts = mergeLegacy();

export const getLegacyProductBySlug = (slug: string) =>
  legacyProducts.find((product) => product.slug === slug) || null;

export const getLegacyFeatured = (limit = 4) => legacyProducts.slice(0, limit);

export const getLegacyNew = (limit = 8) => legacyProducts.slice(0, limit);

const MEN_KEYWORDS = ["men", "mens", "boy", "boys", "male"];
const WOMEN_KEYWORDS = ["women", "womens", "woman", "girl", "girls", "female", "lady", "ladies"];

const includesKeyword = (name: string, keywords: string[]) =>
  keywords.some((keyword) => name.includes(keyword));

const getLegacyGender = (product: Product) => {
  const name = product.name.toLowerCase();
  const isMen = includesKeyword(name, MEN_KEYWORDS);
  const isWomen = includesKeyword(name, WOMEN_KEYWORDS);

  if (isMen && !isWomen) return "men";
  if (isWomen && !isMen) return "women";
  return "unisex";
};

export const getLegacyByCollection = (collection: "men" | "women") =>
  legacyProducts.filter((product) => {
    const gender = getLegacyGender(product);
    return gender === collection || gender === "unisex";
  });
