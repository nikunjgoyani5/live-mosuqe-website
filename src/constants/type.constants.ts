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
