// components/Footer.jsx
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/constants/icons";
import Image from "next/image";
import { ISection, IFooterContent } from "@/constants/section.constants";
import Link from "next/link";

interface IProps {
  data?: ISection;
}

export default function Footer({ data }: IProps) {
  // Type guard and data extraction
  const footerContent =
    data?.content && "copyright" in data.content && "data" in data.content
      ? (data.content as unknown as IFooterContent)
      : null;

  // Extract footer data or use defaults
  const navigationLinks = footerContent?.data || [
    { label: "Home", path: "#" },
    { label: "About Us", path: "#" },
    { label: "Products", path: "#" },
    { label: "Contact", path: "#" },
    { label: "Create Code", path: "#" },
  ];

  const copyrightText =
    footerContent?.copyright ||
    "Copyright © 2021 LIVE MOSQUE - All Rights Reserved.";
  const logoSrc = footerContent?.image || "/logo.png";

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Logo */}
        <Link href={"/"} className="flex justify-center">
          <Image
            src={logoSrc}
            alt="Logo"
            className="h-14 w-14 object-contain"
            width={56}
            height={56}
          />
        </Link>

        {/* Navigation Links */}
        <nav
          className="mt-6 flex flex-wrap justify-center gap-6 text-base
"
        >
          {navigationLinks.map((link, index) => (
            <a key={index} href={link.path} className="hover:text-gray-300">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t !border-light-black my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p className="text-white text-base text-center">{copyrightText}</p>

          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-gray-300">
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
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
