"use client";

import Image from "next/image";
import React from "react";
import { IProduct, IProductContent } from "@/constants/section.constants";
import { ProductSection } from "./ProductSection";
import type { ProductSectionProps } from "./types";
import { productData } from "./constants";
import { getFullImageUrl } from "@/lib/utils";

// Wrapper component
interface IProps {
  data?: IProduct[];
}

const ProductComponent = ({ data }: IProps) => {
  // Transform server product data to match component expectations
  const transformedProducts = data
    ? data
        ?.filter((val) => val.visible)
        .map((product, index) => {
          const productContent =
            product.content as unknown as IProductContent & {
              platforms?: { name: string; image: string; link?: string }[];
              downloadPlatforms?: {
                name: string;
                image: string;
                link?: string;
              }[];
              isVideoEnabled?: boolean;
              btnText?: string;
              path?: string;
              downloadText?: string;
            };

          const imageSrc = getFullImageUrl(
            productContent.media_url ||
              (productContent.images && productContent.images[0]) ||
              "/product1.png"
          );

          // const carouselImages = Array.isArray(productContent.images) ? productContent.images.map(getFullImageUrl) : [];

          const modelImage = Array.isArray(
            Object.values(productContent.modalImages)
          )
            ? Object.values(productContent.modalImages)
                .filter(
                  (image) =>
                    image && typeof image === "string" && image.trim() !== ""
                ) // Remove empty, null, undefined, or whitespace-only values
                .map(getFullImageUrl)
            : [];

          const carouselImages = Array.isArray(
            Object.values(productContent.imagesData)
          )
            ? Object.values(productContent.imagesData)
                .filter(
                  (image) =>
                    image && typeof image === "string" && image.trim() !== ""
                ) // Remove empty, null, undefined, or whitespace-only values
                .map(getFullImageUrl)
            : [];

          const platforms = Array.isArray(productContent.platforms)
            ? productContent.platforms.map((p) => ({
                name: p.name,
                image: getFullImageUrl(p.image),
                link: p.link,
              }))
            : [];

          const downloadPlatforms = Array.isArray(
            productContent.downloadPlatforms
          )
            ? productContent.downloadPlatforms.map((p) => ({
                name: p.name,
                image: getFullImageUrl(p.image),
                link: p.link,
              }))
            : [];

          return {
            typeLabel: productContent.labrl || "Product",
            title: productContent.title || "",
            description: productContent.description || "",
            imageSrc,
            carouselImages,
            slug: product.slug as string | undefined,
            readMoreLabel: productContent["readmore "] || "Read More",
            readMoreHref: "#",
            platforms,
            modelImage,
            downloadPlatforms,
            reverseLayout: index % 2 === 1,
            platformTitle:
              platforms.length > 0
                ? "Order pre-installed Masjid Clock box"
                : undefined,
            videoBtnText: productContent?.btnText || "",
            videoPath: productContent?.path || "",
            downloadText: productContent?.downloadText || "Download It Free",
            isVideoEnabled: productContent?.isVideoEnabled || false,
          } as ProductSectionProps;
        })
    : productData;

  // const transformedProducts: ProductSectionProps[] = productData;

  return (
    <div className="w-full relative">
      {/* Top Right Decorative Image - Extends to screen edge */}
      <div className="absolute  top-0 right-0 w-1/2 sm:w-2/3 md:w-1/2 lg:w-6/12 h-32 sm:h-48 md:h-56 lg:h-64 z-0 pointer-events-none opacity-80 md:opacity-100">
        <Image
          src="/productRightTop.png"
          alt="Top Right Decoration"
          className="w-full h-auto object-contain object-right-top"
          width={256}
          height={256}
        />
      </div>

      {/* Bottom Left Decorative Image - Extends to screen edge */}
      <div className="hidden md:flex absolute bottom-0 left-0 w-5/12 lg:w-6/12 h-1/6 lg:h-1/5 z-0 pointer-events-none opacity-80 lg:opacity-100">
        <Image
          src="/productLeftBottom.png"
          alt="Bottom Left Decoration"
          className="w-full h-auto object-contain object-left-bottom"
          width={100}
          height={100}
        />
      </div>

      {/* Content Container */}
      <div
        id="products"
        className="scroll-section container-1024 px-4 sm:px-0 md:px-8 relative z-10"
      >
        <div className="flex flex-col justify-center items-center pt-14 sm:py-8 md:py-16">
          <div>
            <Image
              src="/Searviceheader.png"
              alt="Product"
              className="w-8 h-10 sm:w-10 sm:h-12 object-contain"
              width={40}
              height={40}
            />
          </div>
          <div className="section-name-heading-responsive font-cinzel text-primary-color mt-2 uppercase">
            Products
          </div>
        </div>
        {transformedProducts.map((p, index) => (
          <ProductSection key={index} {...p} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductComponent;
