"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";

type Props = {
  imageSrc: string;
  index?: number;
  carouselImages?: string[];
};

const ProductImageWithOverlayComponent: React.FC<Props> = ({
  imageSrc,
  index = 0,
  carouselImages: imagesFromApi,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [productCarouselApi, setProductCarouselApi] =
    React.useState<CarouselApi | null>(null);

  React.useEffect(() => setMounted(true), []);

  // Device mockup configurations based on index
  const getDeviceConfig = (deviceIndex: number) => {
    switch (deviceIndex) {
      case 0:
        return {
          containerClasses: "items-end justify-center pb-6",
          deviceClasses: "w-48 h-32 lg:w-[65%] lg:h-[45%] overflow-visible",
          screenClasses: "w-full h-full",
        } as const;
      case 1:
        return {
          containerClasses: "items-end justify-start pl-8 pb-10",
          deviceClasses:
            "w-20 h-44 md:w-28 md:h-60 lg:w-[35%] lg:h-[85%] overflow-visible",
          screenClasses: "w-full h-full",
        } as const;
      case 2:
        return {
          containerClasses: "items-end justify-end pr-8 pb-10",
          deviceClasses:
            "w-20 h-44 md:w-28 md:h-60 lg:w-[37%] lg:h-[85%] overflow-visible",
          screenClasses: "w-full h-full",
        } as const;
      case 3:
        return {
          containerClasses: "items-end justify-start pl-8 pb-10",
          deviceClasses: "w-36 h-44 lg:w-[37%] lg:h-[60%] overflow-visible",
          screenClasses: "w-full h-full",
        } as const;
      default:
        return {
          containerClasses: "items-center justify-center",
          deviceClasses: "w-32 h-24 overflow-visible",
          screenClasses: "w-full h-full",
        } as const;
    }
  };

  const renderDeviceFrame = (
    deviceIndex: number,
    children: React.ReactNode
  ) => {
    switch (deviceIndex) {
      // Laptop/Screen
      case 0:
        return (
          <div className="device device-laptop">
            <div className="device-bezel">
              <div className="screen rounded-[10px] overflow-hidden">
                {children}
              </div>
            </div>
            <div className="device-hinge" />
          </div>
        );
      // Phone
      case 1:
      case 2:
        return (
          <div className="device device-phone taj-card-shadow">
            <div className="device-notch" />
            <div className="device-bezel">
              <div className="screen rounded-[18px] overflow-hidden">
                {children}
              </div>
            </div>
            <div className="device-buttons" />
          </div>
        );
      // Tablet
      case 3:
        return (
          <div className="device device-tablet taj-card-shadow">
            <div className="device-camera z-99" />
            <div className="device-bezel ">
              <div className="screen rounded-[14px] overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="device device-generic">
            <div className="device-bezel">
              <div className="screen overflow-hidden">{children}</div>
            </div>
          </div>
        );
    }
  };

  const deviceConfig = getDeviceConfig(index);
  const carouselImages =
    imagesFromApi && imagesFromApi.length > 0 ? imagesFromApi : [];

  if (!mounted) {
    return (
      <div className="w-full relative">
        <div className="relative">
          <Image
            src={imageSrc}
            alt="Product"
            className="w-full h-60 sm:h-80 md:h-96 lg:h-full object-contain"
            width={384}
            height={384}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="relative">
        <Image
          src={imageSrc}
          alt="Product"
          className="w-full h-60 sm:h-80 md:h-96 lg:h-full lg:max-h-[650px] object-contain"
          width={384}
          height={384}
        />
        {carouselImages.length > 0 && (
          <div
            className={`absolute inset-0 flex ${deviceConfig.containerClasses}`}
          >
            <div className={deviceConfig.deviceClasses}>
              {renderDeviceFrame(
                index,
                <Carousel
                  autoplay
                  setApi={setProductCarouselApi}
                  className="w-full h-full"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  {/* Ensure Embla viewport has height so slides render */}
                  <CarouselContent
                    className="h-full"
                    viewportClassName="h-full"
                  >
                    {carouselImages.map((imageUrl, carouselIndex) => {
                      return (
                        <CarouselItem key={carouselIndex} className="h-full">
                          <div className="relative w-full h-full">
                            <Image
                              src={imageUrl}
                              alt={`Device ${index} screen ${
                                carouselIndex + 1
                              }`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </Carousel>
              )}
            </div>
          </div>
        )}
        {index === 1 && (
          <Image
            src="/imam.png"
            alt="Imam badge"
            width={80}
            height={80}
            className="absolute bottom-0 right-2 w-20 h-20 lg:w-44 lg:h-44 z-20"
          />
        )}
      </div>
    </div>
  );
};

export const ProductImageWithOverlay = React.memo(
  ProductImageWithOverlayComponent
);
