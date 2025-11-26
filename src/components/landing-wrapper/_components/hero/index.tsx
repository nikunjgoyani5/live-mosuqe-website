"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { carouselItems } from "@/constants/dummyData.constants";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ISection, IHeroBannerContent } from "@/constants/section.constants";
import { getFullImageUrl } from "@/lib/utils";
import { he } from "zod/v4/locales";

interface IProps {
  data?: ISection;
}

export default function Hero({ data }: IProps) {
  // For Next.js hydration, since we're using client-side hooks
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data?.visible) return null;
  // Extract hero banner content or fallback to dummy data
  const heroBannerContent = data?.content as unknown as IHeroBannerContent;
  const carouselImages = heroBannerContent?.data
    ? heroBannerContent.data.map((item) => ({
        ...item,
        url: getFullImageUrl(item.url),
      }))
    : carouselItems.map((item) => ({
        type: "image",
        url: getFullImageUrl(item.image),
      }));
  const heroTitle =
    heroBannerContent?.hero_title || "NOT AN ORDINARY MUSLIM APP";
  const heroSubtitle = heroBannerContent?.hero_subtitle || "MUSLIM APP";

  return (
    <div
      id={data?.slug?.replace(/#/g, "") || "hero-section"}
      className="scroll-section relative h-screen w-full overflow-hidden"
    >
      {mounted && (
        <Carousel
          autoplay
          className="h-full w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {carouselImages.map((item, index) => (
              <CarouselItem key={index} className="basis-full">
                <div className="relative h-screen w-full">
                  <Image
                    src={item.url}
                    alt={`Hero banner ${index + 1}`}
                    className="absolute inset-0 h-full w-full lg:object-cover object-cover object-top bg-[#F4F4F4]"
                    width={1920}
                    height={1080}
                  />
                  {/* Subtle overlay for better text readability */}
                  <div className="absolute inset-0 "></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="left-2 sm:left-4 lg:left-6 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                    <CarouselNext className="right-2 sm:right-4 lg:right-6 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" /> */}
        </Carousel>
      )}

      {/* Centered heading and button */}
      <div className="absolute z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          <h3
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl 2xl:text-6xl font-semibold leading-9 sm:leading-tight md:leading-tight lg:leading-tight xl:leading-20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-cinzel-decorative tracking-wide mb-2 text-center line-clamp-2 px-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {heroTitle}
          </h3>
          <h3
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl 2xl:text-6xl font-semibold leading-9 sm:leading-tight md:leading-tight lg:leading-tight xl:leading-20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-cinzel-decorative tracking-wide mb-8 text-center line-clamp-2 mx-auto"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "min(80vw, 520px)",
            }}
          >
            {heroSubtitle}
          </h3>
          <div className="mt-10">
            <a href="https://live-mosque-form.web.app/signup">
              <Button
                className="bg-secondary-color border-0 shadow-none
                                            rounded-lg sm:rounded-lg
                                            cursor-pointer text-dark-100 hover:bg-secondary-color/80 
                                            text-sm sm:text-base md:text-lg font-medium
                                            font-montserrat
                                            py-3 px-6 sm:py-4 sm:px-8 md:py-6 md:px-6
                                            transition-all duration-300 hover:scale-105 hover:shadow-lg
                                            focus:outline-none focus:ring-0 "
              >
                Register Your Masjid
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Fixed bottom-right PNG overlay - responsive sizing */}
      <Image
        src="/heroCarosalText.png"
        alt="decorative badge"
        className="absolute 
                                        
                                        bottom-0 right-4
                                        w-32 h-32 
                                        sm:w-40 sm:h-40 
                                        md:w-52 md:h-52 
                                        lg:w-64 lg:h-64 
                                        xl:w-72 xl:h-72 
                                        2xl:w-80 2xl:h-80
                                       "
        width={320}
        height={320}
      />
    </div>
  );
}
