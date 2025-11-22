"use client";
import LiveMosqueCard from "@/components/liveMosqueCard";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ISection, IServicesContent } from "@/constants/section.constants";

interface IProps {
  data?: ISection;
}
export default function LiveMosqueSection({ data }: IProps) {
  // How far above the top cards the connector lines should extend (in px)
  const DESIRED_ABOVE_TOP_ANCHOR = 280;
  // Dynamic SVG offset computed from layout
  const [svgTopOffset, setSvgTopOffset] = useState<number>(DESIRED_ABOVE_TOP_ANCHOR);

  // Extract services content or fallback to dummy data
  const servicesContent = data?.content as unknown as IServicesContent;
  const sectionTitle = servicesContent?.title || "LIVE MOSQUE";
  const sectionSubtitle = servicesContent?.subtitle || "Stay connected with your community";

  // Fallback static features for when no dynamic data is available
  const fallbackFeatures = [
    {
      title: "IN MASJID DISPLAYS",
      subtitle: "Masjid Clock Displays and use our masjid clock picture",
      image: "/masjid-display.png",
    },
    {
      title: "PHONE APP",
      subtitle: "End user app and our app picture",
      image: "/phone-app.png",
    },
    {
      title: "HOME CLOCK",
      subtitle: "This is a Muslim prayer and Iqamah time clock that…",
      image: "/home-clock.png",
    },
    {
      title: "LIVE MOSQUE",
      subtitle: "Imam Admin App",
      image: "/imam-admin.png",
    },
    {
      title: "DONATIONS",
      subtitle: "Raise more with multiple donation options",
      image: "/donations.png",
    },
  ];

  // Ensure we always have a valid features array with fallbacks
  const rawFeatures = servicesContent?.data || [];

  // Create a features array that always has exactly 5 elements
  const features = fallbackFeatures.map((fallback, index) => {
    const apiFeature = Array.isArray(rawFeatures) && rawFeatures[index] ? rawFeatures[index] : null;

    if (apiFeature && typeof apiFeature === 'object') {
      const merged = {
        ...fallback,
        ...apiFeature,
        // Ensure critical properties always exist
        title: apiFeature.title || fallback.title,
        subtitle: apiFeature.subtitle || fallback.subtitle,
        image: apiFeature.image || fallback.image
      };

      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Feature ${index}:`, merged);
      }

      return merged;
    }

    return fallback;
  });

  // Additional safety check to ensure all features have subtitles
  features.forEach((feature, index) => {
    if (!feature || !feature.subtitle) {
      console.warn(`Feature ${index} missing subtitle, using fallback`);
      features[index] = { ...fallbackFeatures[index] };
    }
  });

  // Refs for anchors above each card (desktop only usage)
  const leftTopRef = useRef<HTMLDivElement>(null);
  const rightTopRef = useRef<HTMLDivElement>(null);
  const leftMidRef = useRef<HTMLDivElement>(null);
  const rightMidRef = useRef<HTMLDivElement>(null);
  const centerBottomRef = useRef<HTMLDivElement>(null); // top taj of bottom center card
  const logoRef = useRef<HTMLDivElement>(null); // center logo (for potential future connection)

  const [paths, setPaths] = useState<{
    verticalLeft: string;
    verticalRight: string;
    bottomLeft: string;
    bottomRight: string;
  } | null>(null);
  const [logoTop, setLogoTop] = useState<number | null>(null);

  const computePathData = () => {
    const container = wrapperRef.current;
    if (!container) return;

    const getCenter = (el: HTMLDivElement | null) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - c.left,
        y: r.bottom - c.top, // keep as bottom for anchors
      };
    };


    const lTop = getCenter(leftTopRef.current);
    const lMid = getCenter(leftMidRef.current);
    const rTop = getCenter(rightTopRef.current);
    const rMid = getCenter(rightMidRef.current);
    const center = getCenter(centerBottomRef.current);

    // Translate wrapper-relative Y coordinates into SVG coordinates
    const fy = (y: number) => y + svgTopOffset;

    // Vertical dashed lines should start at the very top of the SVG (which is offset above the wrapper)
    const containerTop = 0; // 0 in SVG space maps to -svgTopOffset relative to the wrapper

    // Straight vertical dashed lines (extended from top of section to mid cards)
    const verticalLeft = `M ${lTop.x} ${containerTop} L ${lMid.x} ${fy(lMid.y)}`;
    const verticalRight = `M ${rTop.x} ${containerTop} L ${rMid.x} ${fy(rMid.y)}`;



    // New path style: vertical down from mid cards, small rounded corner into horizontal baseline,
    // then gentle upward curve into center bottom card (matching provided design with right-angle + curve feel)
    const cornerR = 40; // radius for the lower outward corner
    // baseline sits some distance below mid cards but above center card anchor
    const baselineY = Math.max(lMid.y, rMid.y) + 120;
    // Ensure baseline below center anchor to allow upward curve
    const adjustedBaselineY = Math.max(baselineY, center.y + 40);
    const upDiff = adjustedBaselineY - center.y; // vertical difference for upward curve

    // Left path construction
    const leftVerticalEnd = adjustedBaselineY - cornerR;
    const leftCornerEndX = lMid.x + cornerR;
    const bottomLeft = [
      `M ${lMid.x} ${fy(lMid.y)}`,
      `L ${lMid.x} ${fy(leftVerticalEnd)}`,
      // Corner (cubic approximating quarter circle)
      `C ${lMid.x} ${fy(leftVerticalEnd + cornerR * 0.5)}, ${lMid.x + cornerR * 0.5
      } ${fy(adjustedBaselineY)}, ${leftCornerEndX} ${fy(adjustedBaselineY)}`,
      // Horizontal run towards center (stop before upward curve start)
      `L ${center.x - upDiff} ${fy(adjustedBaselineY)}`,
      // Upward curve into center anchor (quadratic)
      `Q ${center.x} ${fy(adjustedBaselineY)}, ${center.x} ${fy(center.y)}`,
    ].join(" ");

    // Right path (mirror)
    const rightVerticalEnd = adjustedBaselineY - cornerR;
    const rightCornerEndX = rMid.x - cornerR;
    const bottomRight = [
      `M ${rMid.x} ${fy(rMid.y)}`,
      `L ${rMid.x} ${fy(rightVerticalEnd)}`,
      `C ${rMid.x} ${fy(rightVerticalEnd + cornerR * 0.5)}, ${rMid.x - cornerR * 0.5
      } ${fy(adjustedBaselineY)}, ${rightCornerEndX} ${fy(adjustedBaselineY)}`,
      `L ${center.x + upDiff} ${fy(adjustedBaselineY)}`,
      `Q ${center.x} ${fy(adjustedBaselineY)}, ${center.x} ${fy(center.y)}`,
    ].join(" ");

    setPaths({ verticalLeft, verticalRight, bottomLeft, bottomRight });

    // Compute how far to shift the SVG upward so the vertical lines start above the top anchors
    const topMostAnchorY = Math.min(lTop.y, rTop.y);
    // Move the SVG up so its y=0 is DESIRED_ABOVE_TOP_ANCHOR above the top-most anchor
    const computedOffset = topMostAnchorY + DESIRED_ABOVE_TOP_ANCHOR;
    setSvgTopOffset(computedOffset);

    // Dynamically center the logo vertically between top row (lTop/rTop) and bottom center card anchor
    if (logoRef.current) {
      const logoHeight = logoRef.current.offsetHeight;
      const topMost = Math.min(lTop.y, rTop.y);
      const bottomMost = center.y; // anchor point above bottom center card
      const midPointY = (topMost + bottomMost) / 2; // relative to container top
      const topForLogo = midPointY - logoHeight / 2;
      setLogoTop(topForLogo);
    }
  };

  // Wrapper ref for relative coordinate space
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    computePathData();
  }, []);

  useEffect(() => {
    const handle = () => computePathData();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <section id="services" className="scroll-section relative w-full overflow-hidden pt-10 sm:pt-14 md:pt-16 pb-4 sm:pb-6 md:pb-20">
      {/* Background image full bleed anchored to bottom without cropping */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/live_mosque_pattern.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "100% auto",
        }}
        aria-hidden="true"
      />
      {/* Optional subtle overlay to improve contrast (adjust opacity if needed) */}
      {/* <div className="absolute inset-0 -z-10 bg-white/10" /> */}
      <div className="relative container-1024 mx-auto sm:px-6 lg:px-0">
        <div className="text-center mb-5 md:mb-14">
          <p className="flex justify-center items-center gap-2 mb-1">
            <Image
              src="/Searviceheader.png"
              alt=""
              className="mb-2 h-12 w-10"
              width={32}
              height={40}
            />
          </p>
          <p className="body-description font-montserrat text-dark-100 mb-1">{sectionSubtitle}</p>
          <h2 className="text-primary-color font-cinzel flex flex-col items-center gap-2 section-name-heading-responsive">
            <span>{sectionTitle}</span>
          </h2>
        </div>

        <div className="relative hidden lg:block" ref={wrapperRef}>
          {/* Central Logo (absolutely centered between top & mid rows) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
            ref={logoRef}
            style={logoTop != null ? { top: `${logoTop}px` } : undefined}
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Live Mosque Icon"
                className="w-28 h-28 rounded-xl "
                width={112}
                height={112}
              />
            </div>
          </div>

          {/* Cards Layout */}
          <div className="relative z-10 grid grid-cols-2 justify-between w-full gap-y-16 container-1024 sm:px-6 lg:px-0 ">
            <div className="flex justify-start"><LiveMosqueCard {...features[0]} description={features[0]?.subtitle} anchorRef={leftTopRef} /></div>
            <div className="flex justify-end"><LiveMosqueCard {...features[1]} description={features[1]?.subtitle} anchorRef={rightTopRef} /></div>
            <div className="flex justify-start"><LiveMosqueCard {...features[2]} description={features[2]?.subtitle} anchorRef={leftMidRef} /></div>
            <div className="flex justify-end"><LiveMosqueCard {...features[4]} description={features[4]?.subtitle} anchorRef={rightMidRef} /></div>
            <div className="col-span-2 flex justify-center"><LiveMosqueCard {...features[3]} description={features[3]?.subtitle} anchorRef={centerBottomRef} /></div>
          </div>

          {/* Connector SVG */}
          {paths && (
            <svg
              className="pointer-events-none absolute inset-0 z-0"
              width="100%"
              // increase height to include the extra space above
              height={(wrapperRef.current?.offsetHeight ?? 0) + svgTopOffset}
              // shift the SVG up so y=0 begins svgTopOffset above the wrapper
              style={{ top: `-${svgTopOffset}px` }}
            >
              <defs>
                <marker
                  id="dot"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <circle cx="5" cy="5" r="4" fill="#d1d5db" />
                </marker>
              </defs>
              <path
                d={paths.verticalLeft}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="6 8"
                fill="none"
              />
              <path
                d={paths.verticalRight}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="6 8"
                fill="none"
              />
              <path
                d={paths.bottomLeft}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="8 10"
                fill="none"
              />
              <path
                d={paths.bottomRight}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="8 10"
                fill="none"
              />
            </svg>
          )}
        </div>

        {/* Mobile / Tablet simplified vertical flow */}
        <div className="lg:hidden">
          <div className="flex flex-col items-center md:mb-10 relative z-20">
            {/* <p className="text-[10px] tracking-[2px] font-montserrat text-[#6b6b6b] uppercase mb-2">
              Stay connected with your community
            </p> */}
            <div className="relative mb-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Image src="/taj4.svg" alt="" width={24} height={20} />
              </div>
              <Image
                src="/logo.png"
                alt="Live Mosque Icon"
                className="w-24 h-24 rounded-xl "
                width={300}
                height={300}
              />
            </div>
            {/* <h2 className="text-[#102F82] text-2xl font-bold font-cinzel">
              LIVE MOSQUE
            </h2> */}
          </div>
          <div className="relative flex flex-col items-center gap-10">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-400 -translate-x-1/2" />
            {features.map((feature, i) => (
              <div key={i} className="relative z-10">
                <LiveMosqueCard {...feature} description={feature?.subtitle} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
