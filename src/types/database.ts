// Core domain types — mirror the Supabase schema in supabase/migrations.
// Kept hand-written (rather than generated) for phase 1; once the Supabase
// project exists, replace with `supabase gen types typescript`.

export type StoreStatus = "active" | "temporarily_closed";
export type ProductStatus = "draft" | "published" | "archived";
export type OrderMode = "whatsapp" | "external_link" | "menu_only" | "internal";
export type AppRole = "proprietario" | "administrador" | "editor";
export type LeadStatus =
  | "novo"
  | "em_contato"
  | "orcamento_enviado"
  | "confirmado"
  | "concluido"
  | "cancelado";

export interface Store {
  id: string;
  slug: string;
  name: string;
  neighborhood: string;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  whatsapp: string; // E.164, e.g. 5562996448093
  phone: string | null;
  order_mode: OrderMode;
  external_delivery_links: { label: string; url: string }[];
  photo_url: string | null;
  description: string | null;
  status: StoreStatus;
  display_order: number;
}

export interface StoreHours {
  id: string;
  store_id: string;
  weekday: number; // 0=domingo ... 6=sábado
  opens_at: string | null; // "09:00"
  closes_at: string | null; // "20:00"
  closed: boolean;
}

export interface SpecialHours {
  id: string;
  store_id: string;
  date: string; // ISO date
  opens_at: string | null;
  closes_at: string | null;
  closed: boolean;
  note: string | null;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  display_order: number;
  visible: boolean;
}

export interface Tag {
  id: string;
  slug: string;
  name: string; // e.g. "Zero açúcar", "Sem glúten", "Zero lactose"
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string; // e.g. "Baby (500g)", "Médio (1,5kg)"
  price_delta: number;
}

export interface ProductAddon {
  id: string;
  product_id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  full_description: string | null;
  category_id: string;
  price: number;
  promo_price: number | null;
  price_prefix: "" | "a partir de";
  weight_or_size: string | null;
  yield_info: string | null; // rendimento, e.g. "serve até 10/12 pessoas"
  featured: boolean;
  seasonal: boolean;
  status: ProductStatus;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  tags?: Tag[];
  category?: Pick<Category, "id" | "slug" | "name" | "image_url"> | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  addons?: ProductAddon[];
  store_products?: StoreProduct[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  visible: boolean;
}

export interface ExternalLink {
  id: string;
  store_id: string | null;
  label: string;
  url: string;
  display_order: number;
}

export interface StoreProduct {
  id: string;
  store_id: string;
  product_id: string;
  available: boolean;
  hidden: boolean;
  price_override: number | null;
  promo_price_override: number | null;
  stock_limit: number | null;
  note: string | null;
  external_link: string | null;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_desktop_url: string | null;
  image_mobile_url: string | null;
  button_label: string | null;
  button_link: string | null;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "active" | "ended" | "draft";
  priority: number;
  store_ids: string[];
  product_ids: string[];
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  order_type: string;
  preferred_store_id: string | null;
  desired_date: string | null;
  people_count: number | null;
  budget_hint: string | null;
  description: string;
  reference_image_url: string | null;
  consent: boolean;
  status: LeadStatus;
  created_at: string;
}

// --- Cart / WhatsApp order composition (client-side only, phase 1) ---

export interface CartLine {
  productId: string;
  productName: string;
  quantity: number;
  variant?: string;
  addons?: string[];
  note?: string;
  unitPrice: number;
}

export interface CartState {
  storeId: string | null;
  lines: CartLine[];
}
