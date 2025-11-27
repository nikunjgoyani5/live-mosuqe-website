"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DotButton, useDotButton } from "./useDotButton";
import { Button } from "@/components/ui/Button";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./usePrevNextButtons";
import { Trash2 } from "lucide-react";
import { getFullImageUrl } from "@/lib/utils";
import ImageGuidelines from "@/components/_landing-components/image-guidelines";

function SliderHeroForm({
  data,
  onDelete,
  setCarouselApi,
  uploadedMedias,
}: {
  uploadedMedias?: any[];
  data?: any;
  onDelete: () => void;
  setCarouselApi: (api: CarouselApi) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div>
      <div className="flex justify-end pb-1">
        <ImageGuidelines resolution="1920X920" />
      </div>
      <div className="relative w-full overflow-hidden">
        {mounted && (
          <Carousel
            autoplay={false}
            className="h-full w-full"
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setCarouselApi}
          >
            <CarouselContent className="h-full">
              {data.map(
                (item: any, i: number) =>
                  item.url && (
                    <CarouselItem key={i} className="basis-full">
                      <div className="relative xl:h-[900px] h-screen w-full">
                        {item.type === "video" ? (
                          <video
                            src={`${getFullImageUrl(item.url)}`}
                            autoPlay
                            muted
                            loop
                            controls={false}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={`${getFullImageUrl(item.url)}`}
                            alt={item.url}
                            className="absolute inset-0 h-full w-full object-cover"
                            width={1920}
                            height={1080}
                            priority
                          />
                        )}

                        {/* Optional overlay for readability */}
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    </CarouselItem>
                  )
              )}
              {uploadedMedias?.map(
                (item: any, i: number) =>
                  item.url && (
                    <CarouselItem key={data?.length + i} className="basis-full">
                      <div className="relative xl:h-[900px] h-screen w-full">
                        {item.type === "video" ? (
                          <video
                            src={`${getFullImageUrl(item.url)}`}
                            autoPlay
                            muted
                            loop
                            controls={false}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={`${getFullImageUrl(item.url)}`}
                            alt={item.url}
                            className="absolute inset-0 h-full w-full object-cover"
                            width={1920}
                            height={1080}
                            priority
                          />
                        )}

                        {/* Optional overlay for readability */}
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    </CarouselItem>
                  )
              )}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4 lg:left-6 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white fill-white border-0 bg-black/20 cursor-pointer" />
            <CarouselNext className="right-2 sm:right-4 lg:right-6 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white fill-white border-0 bg-black/20 cursor-pointer" />
          </Carousel>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute bottom-4 right-4 bg-white rounded p-2 shadow hover:bg-gray-100 z-10 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}

export default SliderHeroForm;
