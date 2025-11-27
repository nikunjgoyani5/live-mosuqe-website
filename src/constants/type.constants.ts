import { INewsItem, ISection } from "./section.constants";

export interface CardData {
    decorativeImage?: {
        src?: string;
        alt?: string;
    };
    mainImage?: {
        src?: string;
        alt?: string;
    };
    title: string;
    description: string;
    styles?: {
        titleColor?: string;
        titleFont?: string;
        descriptionFont?: string;
    };
}



// Union type for both news item formats
export type UnifiedNewsItem = NewsItem | INewsItem;

export interface FeaturedCardProps {
  className?: string;
  item: UnifiedNewsItem;
  index?: number; // used to build /news/[id] fallback
}

export interface IProps {
  data?: ISection;
}

export type NewsItem = {
  id: number
  title: string
  excerpt: string
  date: string // ISO string or display string
  image: string
  href?: string
}
