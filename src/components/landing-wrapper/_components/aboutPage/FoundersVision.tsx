"use client";

import { ISection } from "@/constants/section.constants";
import { getFullImageUrl } from "@/lib/utils";

interface IProps {
  data?: ISection;
}

const isVideo = (url?: string) =>
  url ? /\.(mp4|webm|ogg)(\?.*)?$/i.test(url) : false;
const toUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return getFullImageUrl(`${url}`);
};

export default function FoundersVision({ data }: IProps) {
  if (!data?.visible) return null;
  const content = (data?.content as Record<string, any>) || {};
  const title: string = content.title || "Founder's Vision";
  const description: string = content.description || "";
  const mediaUrl = toUrl(content.media_url);

  return (
    <section className="relative w-full min-h-[440px] md:min-h-[520px] lg:min-h-[600px] overflow-hidden bg-black">
      {/* Background media */}
      {/* {mediaUrl ? (
                isVideo(mediaUrl) ? (
                    <video
                        src={mediaUrl}
                        className="absolute inset-0 w-full h-full object-contain opacity-70"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : ( */}
      <div
        className="absolute inset-0 bg-center bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(${mediaUrl})` }}
      />
      {/* )
            ) : null} */}

      {/* Overlay gradient for readability */}

      {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/20" /> */}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1320px] min-h-[440px] md:min-h-[520px] lg:min-h-[600px] flex flex-col justify-center ">
        <div className="max-w-2xl text-white px-3 lg:px-0">
          <h2 className="heading-responsive 2xl:max-w-2xl  font-bold text-white leading-snug font-cinzel-decorative max-w-xl">
            {title}
          </h2>
          <div className="text-white mt-5 body-description max-w-xl 2xl:max-w-2xl pb-8 sm:pb-8 leading-7 space-y-3">
            {description
              .toString()
              .split(/\n+/)
              .map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
