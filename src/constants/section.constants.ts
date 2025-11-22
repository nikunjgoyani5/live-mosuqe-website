// sectionTypes.js
export const SECTION_TYPES = {
  HEADER: "HEADER",
  HERO_BANNER: "HERO_BANNER",
  LATEST_NEWS: "LATEST_NEWS",
  SERVICES: "SERVICES",
  ABOUTUS: "ABOUTUS",
  PRODUCTS: "PRODUCTS",
  TESTIMONIALS: "TESTIMONIALS",
  CONTACTUS: "CONTACTUS",
  FOOTER: "FOOTER",
  ABOUTUSPAGE: "ABOUTUSPAGE",
  FOUNDERVISION: "FOUNDERVISION",
  EMPOWERING: "EMPOWERING",
};

// sectionTypes.ts
export const SECTION_DATA_MAPING = {
  HEADER: "HEADER",
  HERO_BANNER: "HERO_BANNER",
  LATEST_NEWS: "LATEST_NEWS",
  SERVICES: "SERVICES",
  ABOUTUS: "ABOUTUS",
  PRODUCTS: "PRODUCTS",
  TESTIMONIALS: "TESTIMONIALS",
  CONTACTUS: "CONTACTUS",
  FOOTER: "FOOTER",
  ABOUTUSPAGE: "ABOUTUSPAGE",
  FOUNDERVISION: "FOUNDERVISION",
  EMPOWERING: "EMPOWERING",
  DONATION: "DONATION",
} as const;

// Extract union of keys ("HEADER" | "HERO_BANNER" | ...)
export type SectionType = keyof typeof SECTION_DATA_MAPING;

export interface INavLink {
  label: string;
  path: string;
}

export interface IContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  socials: ISocial[];
}

export interface ISocial {
  name: string;
  url: string;
}

export interface IHeaderContent {
  data: INavLink[];
  info: IContactInfo;
}

export interface INewsItem {
  image?: string;
  title: string;
  subtitle: string;
  read_more?: string;
  "read more"?: string;
  postdate: string;
  location?: string;
  name?: string;
  rating?: string;
  text?: string;
}

export interface ILatestNewsContent {
  data: INewsItem[];
}

export interface IProductContent {
  labrl: string; // Note: appears to be a typo in the API
  title: string;
  description: string;
  images: string[];
  modalImages: any;
  media_type: string;
  media_url: string;
  "readmore "?: string;
  imagesData: any;
}

export interface ITestimonialItem {
  name: string;
  location: string;
  text: string;
  image: string;
  rating: string;
}

export interface ITestimonialsContent {
  title: string;
  data: ITestimonialItem[];
}

export interface IContactFormFields {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export interface IContactContent {
  title: string;
  description: string;
  call: string;
  email: string;
  location: string;
  office_title: string;
  office_hours: string;
  "office_hours "?: string;
  form: IContactFormFields;
}

export interface IHeroBannerImage {
  type: string;
  url: string;
}

export interface IHeroBannerContent {
  hero_title: string;
  hero_subtitle: string;
  data: IHeroBannerImage[];
}

export interface IServiceItem {
  title: string;
  subtitle: string;
  image: string;
}

export interface IServicesContent {
  title: string;
  subtitle: string;
  data: IServiceItem[];
}

export interface IAboutUsContent {
  title: string;
  subtitle: string;
  body1: string;
  body2: string;
  main: string;
  "main "?: string;
  main_subtitle: string;
  "main_subtitle "?: string;
  readmore: string;
  "readmore "?: string;
  media_type: string;
  media_url: string;
  description?: string;
  call?: string;
  email?: string;
  location?: string;
  office_title?: string;
  office_hours?: string;
  form?: IContactFormFields;
  body2d?: string;
}

export interface IFooterContent {
  copyright: string;
  data: INavLink[];
  image?: string;
}

export interface ISection {
  isSection: boolean;
  _id: string;
  name: string;
  page: string;
  slug: string;
  orderIndex: number;
  visible: boolean;
  content:
    | IHeaderContent
    | ILatestNewsContent
    | IProductContent
    | IHeroBannerContent
    | IServicesContent
    | IAboutUsContent
    | Record<string, unknown>;
} // Define the structure for products which is an array
export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  orderIndex: number;
  visible: boolean;
  isSection: boolean;
  page: string;
  content: Record<string, unknown>;
}

// ✅ Updated type to handle PRODUCTS as array and others as single objects
export type ISections = {
  [K in SectionType]: K extends "PRODUCTS" ? IProduct[] : ISection;
};

export interface IOption {
  label: string;
  value: string;
}

export interface IMenu {
  label: string;
  path: string;
}

export interface IBlog {
  image?: string;
  id: string;
  title: string;
  subtitle: string;
  postdate: string; // or Date if you parse it
  read_more: string; // URL or text
}

export interface IService {
  image?: string;
  title: string;
  subtitle: string;
  id: string;
}

export interface ITestimonial {
  image: string;
  name: string;
  text: string;
  rating: string; // or number if you prefer to store it as a numeric value
  location: string;
  id: string;
}
