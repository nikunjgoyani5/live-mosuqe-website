"use client";
import { ISections, SECTION_DATA_MAPING } from "@/constants/section.constants";
import FooterSection from "./footer-section";
import ContactSection from "./contact-section";
import TestimonialsSection from "./testimonials-section";
import AboutSection from "./about-section";
import HeaderSection from "./header-section";
import HeroSection from "./hero-section";
import LatestNewsSection from "./latest-section";
import ServicesSection from "./service-section";
import ProductsSection from "./products-section";
import WelcomeSection from "./welcome-section";
import AboutPageSection from "./AboutPage";
import FounderVisionSection from "./founder-vision";
import EmpowerMasjidSection from "./empowering-masjid";
import { useState } from "react";

interface IProps {
  data: ISections;
}

export default function AdminWrapper({ data }: IProps) {
  const [activeTab, setActiveTab] = useState("home");

  const pathOptions = Object.entries(data).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value
        .filter((item) => item.page === "home" && item.isSection)
        .map((item) => ({
          value: item.slug,
          label: item.name,
        }));
    } else if (
      typeof value === "object" &&
      value !== null &&
      value.isSection &&
      value.page === "home"
    ) {
      return [
        {
          value: value.slug,
          label: value.name,
        },
      ];
    }
    return [];
  });
  return (
    <div className="admin-body h-[100vh] overflow-auto">
      <WelcomeSection />
      <div className="flex justify-center my-4">
        <button
          className={`px-4 py-2 rounded-l-lg cursor-pointer ${
            activeTab === "home" ? "bg-primary-color text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("home")}
        >
          Home Page
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg cursor-pointer ${
            activeTab === "about"
              ? "bg-primary-color text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("about")}
        >
          About Page
        </button>
      </div>
      {activeTab === "home" && (
        <>
          <HeaderSection
            data={data[SECTION_DATA_MAPING.HEADER]}
            pathOptions={pathOptions}
          />
          <HeroSection data={data[SECTION_DATA_MAPING.HERO_BANNER]} />
          <LatestNewsSection data={data[SECTION_DATA_MAPING.LATEST_NEWS]} />
          <ServicesSection data={data[SECTION_DATA_MAPING.SERVICES]} />
          <AboutSection data={data[SECTION_DATA_MAPING.ABOUTUS]} />
          {data[SECTION_DATA_MAPING.PRODUCTS].map((val) => (
            <ProductsSection data={val} />
          ))}
          <TestimonialsSection data={data[SECTION_DATA_MAPING.TESTIMONIALS]} />
          <ContactSection data={data[SECTION_DATA_MAPING.CONTACTUS]} />
          <FooterSection
            data={data[SECTION_DATA_MAPING.FOOTER]}
            pathOptions={pathOptions}
          />
        </>
      )}

      {activeTab === "about" && (
        <>
          <AboutPageSection data={data[SECTION_DATA_MAPING.ABOUTUSPAGE]} />
          <FounderVisionSection
            data={data[SECTION_DATA_MAPING.FOUNDERVISION]}
          />
          <EmpowerMasjidSection data={data[SECTION_DATA_MAPING.EMPOWERING]} />
        </>
      )}
    </div>
  );
}
