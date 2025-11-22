import Image from "next/image";
import React from "react";
import { ImageOff } from "lucide-react";

interface LiveMosqueCardProps {
  title: string;
  description: string;
  image?: string;
  /**
   * Optional ref forwarded to the decorative taj top element.
   * Used by the parent section to calculate connector line paths.
   */
  anchorRef?: React.Ref<HTMLDivElement>;
}

export default function LiveMosqueCard({
  title,
  description,
  image,
  anchorRef,
}: LiveMosqueCardProps) {
  return (
    <div className="relative flex justify-center">
      {/* Wrapper with taj protruding (shadow only on card body) */}
      <div className="relative w-[320px] lg:w-[420px] max-w-[520px] mx-auto">
        {/* Taj decorative (anchor) positioned to touch card */}
        <div
          ref={anchorRef}
          className="absolute left-1/2 -translate-x-1/2 h-8 flex items-start justify-center pointer-events-none select-none z-10 bottom-[100%] mb-[-1px]"
        >
          <Image
            src="/taj4shadow.svg"
            alt="taj4"
            className="h-8 w-auto "
            width={32}
            height={32}
          />
        </div>
        {/* Card body with shadow (excluding taj) */}
        <div className="rounded-2xl shadow-[0_1px_20px_1px_rgba(0,0,0,0.25),0_25px_30px_-15px_rgba(0,0,0,0.15),0_10px_10px_-5px_rgba(0,0,0,0.1)] bg-secondary-color pb-1.5 mt-0">
          <div className="bg-white rounded-2xl px-3 py-4 flex gap-5 items-start min-h-[80px]">
            <div className="flex-shrink-0 w-24 h-18 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  width={96}
                  height={72}
                />
              ) : (
                <ImageOff className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <h3
                className="font-cinzel font-bold text-[#102F82] text-base leading-snug truncate"
                title={title}
              >
                {title}
              </h3>
              <p
                className="font-montserrat text-dark-100 text-sm leading-relaxed line-clamp-description "
                title={description}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
