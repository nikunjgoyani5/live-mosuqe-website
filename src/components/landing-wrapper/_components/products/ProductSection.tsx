'use client';

import React from 'react';
import { ProductImageWithOverlay } from './ProductImageWithOverlay';
import { ProductBody } from './ProductBody';
import type { ProductSectionProps } from './types';

export const ProductSection: React.FC<ProductSectionProps> = ({
    typeLabel = '',
    title,
    description,
    imageSrc,
    index,
    carouselImages,
    platforms = [],
    downloadPlatforms = [],
    platformTitle = '',
    readMoreLabel = 'Read More',
    readMoreHref = '#',
    reverseLayout = false,
    slug,
}) => {
    const sectionId = React.useMemo(() => {
        if (!slug) return undefined;
        // slug can be like "#product-mobile"; we want element id without '#'
        return slug.startsWith('#') ? slug.slice(1) : slug;
    }, [slug]);
    return (
        <div id={sectionId} className={`flex flex-col lg:flex-row pt-6 sm:pt-0 ${reverseLayout ? 'lg:flex-row-reverse' : ''} w-full gap-0`}>
            <ProductImageWithOverlay imageSrc={imageSrc} index={index} carouselImages={carouselImages} />
            <ProductBody
                typeLabel={typeLabel}
                title={title}
                description={description}
                platforms={platforms}
                downloadPlatforms={downloadPlatforms}
                platformTitle={platformTitle}
                readMoreLabel={readMoreLabel}
                slug={slug}
            />
        </div>
    );
};
