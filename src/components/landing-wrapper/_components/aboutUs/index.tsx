"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Card from "../services/cards";
import Image from "next/image";
import { ISection, IAboutUsContent } from "@/constants/section.constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFullImageUrl } from "@/lib/utils";

interface IProps {
  data?: ISection;
}

export default function AboutSection({ data }: IProps) {
  const router = useRouter();

  if (!data?.visible) return null;
  // Extract about us content or fallback to static data
  const aboutUsContent = data?.content as unknown as IAboutUsContent;
  const sectionTitle =
    aboutUsContent?.title ||
    "LIVE MOSQUE - THE SERVICE IS COMPLETELY FREE TO ANY MASJID.";
  const sectionSubtitle =
    aboutUsContent?.subtitle ||
    "Live Mosque helps display Iqama times in the Masjid and allows users to view them on their phones. It also offers events, notifications, free live streaming of sermons (khutbah) and azan. Choose between manual or automatic Iqama updates, and manage everything easily with the dedicated Imam (admin) app.";
  const featureBody1 =
    aboutUsContent?.body1 ||
    "Masjid Clock is compatible with Wi-Fi and Offline Operation. A Wi-Fi connection is strongly recommended for real-time.";
  const featureBody2 =
    aboutUsContent?.body2 ||
    "In offline mode , a mobile hotspot connection is required whenever you update the salah times.";
  const sinceYear = aboutUsContent?.main || aboutUsContent?.["main "] || "2019";
  const communityText =
    aboutUsContent?.main_subtitle ||
    aboutUsContent?.["main_subtitle "] ||
    "Years of contributing we invite you to become a part of the Live Mosque community.";
  const mediaUrl = getFullImageUrl(
    aboutUsContent?.media_url || "/aboutUsRight.png"
  );
  const buttonText =
    aboutUsContent?.readmore || aboutUsContent?.["readmore "] || "Read More";
  const sectionName = data?.name || "ABOUT US";
  // console.log("AboutSection data:", data);
  // Inline responsive breakpoint handling for maxWidth
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const handle = () => setVw(window.innerWidth);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // Adjust these to match your Tailwind config if customized
  const BREAKPOINTS = {
    sm: 640,
    laptop: 1284,
    desktop: 1600,
  } as const;

  // Mirror Tailwind sizes: max-w-xl (36rem), max-w-3xl (48rem)
  const computedRightPaneMaxWidth = (() => {
    if (vw >= BREAKPOINTS.desktop) return "52rem";
    if (vw >= BREAKPOINTS.sm) return "42rem";
    return undefined; // base: no max-width
  })();

  // Apply py-32 (8rem) only after custom desktop breakpoint
  const computedContentPaddingY =
    vw >= BREAKPOINTS.desktop ? "8rem" : undefined;
  return (
    <section
      id="about-us"
      className="scroll-section relative w-full bg-primary-color pt-5 overflow-hidden"
    >
      {/* Background Image Overlay */}
      <div
        className="opacity-4 pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/aboutUsBg.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "100% auto",
        }}
        aria-hidden="true"
      />

      {/* Content Wrapper */}
      <div
        className="z-10 mx-auto max-w-[1320px] px-4 md:pl-4 md:pr-0 w-full grid grid-cols-1 lg:grid-cols-3 items-center gap-1 md:gap-10 py-12 sm:py-16"
        style={{
          paddingTop: computedContentPaddingY,
          paddingBottom: computedContentPaddingY,
        }}
      >
        {/* Left Side */}
        <div className="col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
          {/* Header with Mosque Icon */}
          <div className="flex flex-col items-center lg:items-start gap-2">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center">
                <Image
                  src="/ServiceHeadericon.png"
                  alt="Mosque Icon"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <span className="text-white text-justify text-lg 2xl:text-xl font-medium mt-1 line-clamp-1 max-w-xs">
              {sectionName}
            </span>
          </div>

          {/* Heading */}
          <h1 className="heading-responsive 2xl:max-w-2xl  font-bold text-secondary-color leading-snug font-cinzel-decorative max-w-xl line-clamp-2">
            {sectionTitle}
          </h1>

          {/* Description */}
          <p className="text-white body-description max-w-xl 2xl:max-w-2xl mb-8 sm:mb-8 line-clamp-5 text-justify">
            {sectionSubtitle}
          </p>

          {/* Feature Cards */}
          <div className="flex flex-col sm:flex-row gap-10 md:gap-4 w-full max-w-xl">
            <div>
              <Card showInnerImage={false} description={featureBody1} />
            </div>
            <div>
              <Card showInnerImage={false} description={featureBody2} />
            </div>
          </div>

          {/* Button */}
          <div className="flex z-9 justify-center lg:justify-start w-full">
            <PrimaryButton
              className="bg-secondary-color mt-6 hover:bg-secondary-color/90 text-dark-100 !text-sm font-medium rounded-2xl flex items-center justify-start shadow-md px-4"
              style={{ width: "145px", minHeight: "54px", textAlign: "center" }}
              onClick={() => router.push("/about-us")}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap w-full block">
                {buttonText}
              </span>
            </PrimaryButton>
          </div>
        </div>

        {/* Mobile Since 2019 Card - Only visible on mobile */}
        <div className="xl:hidden relative w-full pt-28 md:pt-32 max-w-sm sm:max-w-md mx-auto mt-8">
          {/* Since 2019 card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-[300px] max-w-[80vw] z-20">
            <div className="rounded-4xl bg-gradient-to-b from-white to-white/0 p-0.5 flex flex-col items-center justify-center text-center w-full">
              <div className="rounded-4xl pb-6 pt-4 px-6 bg-primary-color flex flex-col items-center justify-center text-center">
                <h2 className="tracking-wide text-3xl sm:text-4xl font-bold text-secondary-color font-montagu text-nowrap max-w-[220px] sm:max-w-[250px] overflow-hidden text-ellipsis">
                  Since &nbsp;
                  {/* <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-primary-color to-secondary-color/30">
                    e
                  </span>{" "} */}
                  {sinceYear}
                </h2>
                <p className="mt-2 text-white/95 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {communityText}
                </p>
              </div>
            </div>
          </div>

          {/* Phone Image */}
          <Image
            src={mediaUrl}
            alt="About Us Overlay"
            className="relative z-20 w-full h-auto rounded-2xl lg:rounded-none object-contain"
            width={500}
            height={500}
          />
        </div>
      </div>

      {/* Desktop Right Side with Image and Since 2019 Card */}
      <div
        className="hidden xl:block absolute inset-0 pointer-events-none "
        aria-hidden="true"
      >
        {/* Right illustration + centered overlay group */}
        <div
          className="absolute right-0 bottom-10 z-10 w-full"
          style={{ maxWidth: computedRightPaneMaxWidth }}
        >
          <div className="hidden md:block relative w-full">
            <Image
              src={mediaUrl}
              alt="About Us Overlay"
              className="w-full h-auto object-contain relative z-20 block"
              width={500}
              height={500}
              style={{
                borderRadius: "45px 0px 0px 45px",
              }}
            />

            {/* Centered Since 2019 card attached to image; partly behind image - Desktop only */}
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full translate-y-8 sm:translate-y-10 md:translate-y-8 w-[370px] max-w-[80vw] z-10">
              <div className="mt-2 rounded-4xl bg-gradient-to-b from-white to-white/0 p-0.5 flex flex-col items-center justify-center text-center">
                <div className="rounded-4xl pb-10 pt-3 bg-primary-color flex flex-col items-center justify-center text-center w-full">
                  <h2 className="tracking-wide text-[40px] font-bold text-secondary-color font-montagu text-nowrap max-w-[272px] overflow-hidden text-ellipsis">
                    Since &nbsp;
                    {/* <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-primary-color to-secondary-color/30">
                      e
                    </span>{" "} */}
                    {sinceYear}
                  </h2>
                  <p className="mt-1 text-white/95 text-base leading-relaxed max-w-md line-clamp-3">
                    {communityText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Right Side Image - Only the phone mockup without the Since 2019 card overlay */}
    </section>
  );
}
