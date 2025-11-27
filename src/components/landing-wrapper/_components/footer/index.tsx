// components/Footer.jsx
"use client";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/constants/icons";
import Image from "next/image";
import { ISection, IFooterContent } from "@/constants/section.constants";
import { navigationLinks } from "@/constants/dummyData.constants";
import Link from "next/link";

interface IProps {
  data?: ISection;
  socialLinks: { name: string; url: string }[];
}

export default function Footer({ data, socialLinks = [] }: IProps) {
  // Type guard and data extraction
  if (!data?.visible) return null;
  const footerContent =
    data?.content && "copyright" in data.content && "data" in data.content
      ? (data.content as unknown as IFooterContent)
      : null;

  // Extract footer data or use defaults - use same navigation links as header
  const navLinks =
    footerContent?.data ||
    navigationLinks.map((link) => ({
      label: link.label,
      path: link.href,
    }));

  const copyrightText =
    footerContent?.copyright ||
    "Copyright © 2021 LIVE MOSQUE - All Rights Reserved.";

  // Social links config (dynamic from data or fallback)
  const socialIconsMap = {
    LinkedIn: LinkedInIcon,
    Instagram: InstagramIcon,
    Twitter: TwitterIcon,
    Facebook: FacebookIcon,
  };
  const socialIconsMapURLS = {
    Twitter: "https://x.com/livemosqueus",
    Facebook: "https://www.facebook.com/livemosque.live",
  };
  console.log("headerContent", socialLinks);

  let socialLinksList =
    socialLinks && Array.isArray(socialLinks)
      ? socialLinks
          .map((item) => ({
            name: item.name,
            //@ts-ignore
            href: item?.url || socialIconsMapURLS[item?.name] || "",
            //@ts-ignore
            Icon: socialIconsMap[item?.name],
            //@ts-ignore
            enabled: item?.url || socialIconsMapURLS[item?.name] || "",
          }))
          .filter((link) => link.enabled)
      : [];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Logo */}
        <Link
          href={"/"}
          className="flex justify-center"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            className="h-14 w-14 object-contain"
            width={100}
            height={100}
          />
        </Link>

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-wrap justify-center gap-6 text-base">
          {navLinks.map((link, index) => {
            return (
              <a
                key={index}
                href={link.path}
                className="hover:text-gray-300 cursor-pointer truncate-link"
                onClick={(e) => {
                  // Only handle smooth scrolling if it's a section link (starts with #)
                  if (link.path.startsWith("#") && link.path !== "#") {
                    e.preventDefault();
                    const element = document.querySelector(link.path);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }
                }}
                style={{
                  display: "inline-block",
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  verticalAlign: "bottom",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t !border-light-black my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <Link
            href={"/"}
            className="flex  justify-center"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <p className="text-white text-base text-center">{copyrightText}</p>
          </Link>
          <div className="flex gap-4 text-lg">
            {socialLinksList.map((item, i) => (
              <a
                key={item?.href + "" + i}
                href={item?.href}
                className="hover:text-gray-300"
              >
                <item.Icon />
              </a>
            ))}
            {/* <a href="#" className="hover:text-gray-300">
              <FacebookIcon />
            </a>
            <a href="#" className="hover:text-gray-300">
              <InstagramIcon />
            </a>
            <a href="#" className="hover:text-gray-300">
              <LinkedInIcon />
            </a>
            <a href="#" className="hover:text-gray-300">
              <TwitterIcon />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
