"use client";

export type Platform = {
  name: string;
  image: string; // path to platform logo under public/
  link?: string; // optional URL to open when clicked
};

export type ProductSectionProps = {
  typeLabel?: string;
  title: string;
  description: string;
  imageSrc: string;
  // Optional product index to control visuals like overlay positioning/images
  index?: number;
  platforms?: Platform[];
  downloadPlatforms?: Platform[];
  // Images to render inside the device overlay carousel
  carouselImages?: string[];
  // Hash slug like "#product-mobile" used for sharing and anchor scrolling
  slug?: string;
  platformTitle?: string;
  readMoreLabel?: string;
  readMoreHref?: string; // reserved if we switch to a dedicated page
  videoBtnText?: string; // reserved if we switch to a dedicated page
  downloadText?: string; // reserved if we switch to a dedicated page
  videoPath?: string; // reserved if we switch to a dedicated page
  reverseLayout?: boolean;
  isVideoEnabled?: boolean;
  modelImage?: string[];
};
