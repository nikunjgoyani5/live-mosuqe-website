"use client";

import Image from "next/image";
import { ISection } from "@/constants/section.constants";
import { Button } from "@/components/ui/Button";
import { getFullImageUrl } from "@/lib/utils";

interface IProps {
  data?: ISection;
}

const getMediaUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return getFullImageUrl(`${url}`);
};

export default function Donation({ data }: IProps) {
  if (!data?.visible) return null;
  const content = (data?.content as Record<string, any>) || {};
  const title: string =
    content.title ||
    "Live Mosque - The service is completely free to any Masjid.";
  const label: string = content.label || "Donation";
  const description: string = content.description || "";
  const mediaUrl = getMediaUrl(content.media_url) || "/newsPage.png";

  // Simple year badge value; default shows 03+, but allow overriding via content.years
  const years: string = content.years || "03+";

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="flex flex-col gap-3 mb-3 w-full justify-center items-center">
        <Image
          src="/Searviceheader.png"
          alt={label}
          className="mb-2 h-12 w-10 "
          width={32}
          height={40}
        />
        <div className="flex gap-3 flex-row items-center justify-between">
          <h2 className="text-primary-color section-name-heading-responsive font-cinzel">
            {label}
          </h2>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1320px] px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center md:py-12">
        {/* Left: Feature image with small badge card */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-black/5">
            <Image
              src={mediaUrl}
              alt={title || label}
              width={900}
              height={650}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right: Copy */}
        <div>
          <h2 className="heading-responsive 2xl:max-w-2xl  font-bold text-primary-color leading-snug font-cinzel-decorative max-w-xl">
            {title}
          </h2>

          {/* Description with line-break support */}
          <div className="text-dark-100 mt-5 body-description max-w-xl 2xl:max-w-2xl pb-8 sm:pb-8">
            {description
              .toString()
              .split(/\n+/)
              .map((line: string, idx: number) => (
                <p key={idx}>{line}</p>
              ))}
          </div>
          <Button
            asChild
            className="bg-secondary-color border-0 shadow-none
                                            rounded-lg sm:rounded-lg
                                            cursor-pointer text-dark-100 hover:bg-secondary-color/80 
                                            text-sm sm:text-base md:text-lg font-medium
                                            font-montserrat
                                            py-3 px-6 sm:py-4 sm:px-8 md:py-6 md:px-6
                                            transition-all duration-300 hover:scale-105 hover:shadow-lg
                                            focus:outline-none focus:ring-0 "
          >
            <a href={content?.path || "#"} target="_blank">
              {content?.btnText || "Donate now"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
