"use client";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {
  CallIcon,
  WhatsappIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  MailIcon,
} from "@/constants/icons";
import { navigationLinks, headerButton } from "@/constants/dummyData.constants";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { ISection, IHeaderContent } from "@/constants/section.constants";
import Link from "next/link";
import EditableSocialIcons from "@/components/admin-wrapper/_components/EditableSocialLink";

interface IProps {
  data?: ISection;
}

export default function Header({ data }: IProps) {
  console.log("Header data:", data);
  const [open, setOpen] = useState(false);

  if (!data?.visible) return null;
  // Type guard to check if content is header content
  const headerContent =
    data?.content && "data" in data.content && "info" in data.content
      ? (data.content as IHeaderContent)
      : null;

  // Extract navigation links from data or use default
  const navLinks =
    headerContent?.data ||
    navigationLinks.map((link) => ({
      label: link.label,
      path: link.href,
    }));

  // Extract contact info from data or use default
  const contactInfo = {
    phone: headerContent?.info?.phone || "+1-347-302-8394",
    whatsapp: headerContent?.info?.whatsapp || "+1-347-302-8394",
    email: headerContent?.info?.email || "info@livemosque.live",
  };

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
  console.log("headerContent.info.socials", headerContent);

  let socialLinks =
    headerContent?.info?.socials && Array.isArray(headerContent.info.socials)
      ? headerContent?.info?.socials
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

  // Build socialLinks array from data?.content?.info?.socials if available
  // let socialLinks = socialIcons
  //   .map((item) => {
  //     let url = "";
  //     if (
  //       headerContent?.info?.socials &&
  //       Array.isArray(headerContent.info.socials)
  //     ) {
  //       const found = headerContent.info.socials.find(
  //         (s: any) => s.name?.toLowerCase() === item.name.toLowerCase()
  //       );
  //       url = found?.url || "";
  //     }
  //     // fallback for Twitter and Facebook if not provided
  //     if (!url) {
  //       if (item.name === "Twitter") url = "https://x.com/livemosqueus";
  //       if (item.name === "Facebook")
  //         url = "https://www.facebook.com/livemosque.live";
  //     }
  //     return {
  // name: item.name,
  // href: url,
  // Icon: item.Icon,
  // enabled: !!url,
  //     };
  //   })
  //   .filter((link) => link.enabled);

  // Detect if user is on mobile
  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Function to handle email click - works for both mobile and desktop
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isMobile()) {
      // For mobile: Use mailto protocol to open email app
      window.location.href = `mailto:${contactInfo.email}`;
    } else {
      // For desktop: Open Gmail in new tab with compose window
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        contactInfo.email
      )}`;
      window.open(gmailUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Function to handle mobile drawer email click
  const handleMobileDrawerEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);

    if (isMobile()) {
      // For mobile: Use mailto protocol to open email app
      window.location.href = `mailto:${contactInfo.email}`;
    } else {
      // For desktop: Open Gmail in new tab with compose window
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        contactInfo.email
      )}`;
      window.open(gmailUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <header className="absolute top-0 left-0 xl:left-1/2 xl:-translate-x-1/2 container-1024 z-50 justify-between flex flex-col px-2 lg:px-4">
      {/* Top Bar */}
      <div className="hidden xl:flex text-white font-medium text-sm xl:text-base py-3 xl:py-4 justify-between items-center">
        {/* Left side: phone + whatsapp */}
        <div className="flex gap-4 xl:gap-6">
          <div className="flex items-center gap-2 text-sm max-w-[180px] overflow-hidden whitespace-nowrap truncate">
            <p className="w-5 h-5">
              <CallIcon />
            </p>{" "}
            <span className="truncate">{contactInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm max-w-[180px] overflow-hidden whitespace-nowrap truncate">
            <p className="w-5 h-5">
              <WhatsappIcon />
            </p>{" "}
            <span className="truncate">{contactInfo.whatsapp}</span>
          </div>
        </div>

        {/* Right side: socials + email */}
        {socialLinks.length > 0 && (
          <div className="flex cursor-pointer items-center gap-3 text-sm">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                className="hover:text-gray-300"
              >
                <Icon />
              </a>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 xl:gap-6 text-sm max-w-[250px] overflow-hidden whitespace-nowrap truncate">
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center gap-3 hover:text-gray-300 cursor-pointer max-w-full overflow-hidden whitespace-nowrap truncate"
            onClick={handleEmailClick}
            title="Click to email us"
          >
            <p className="w-5 h-5">
              <MailIcon />
            </p>
            <span className="truncate">{contactInfo.email}</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white rounded-2xl shadow-sm mt-2 xl:mt-0">
        <div className="flex items-center justify-between py-1.5 px-1.5 pr-3 gap-6">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 xl:w-14 xl:h-14 rounded-lg"
              width={56}
              height={56}
            />
          </Link>

          {/* Nav Links (show only at xl and above) */}
          <nav className="hidden xl:flex gap-4 xl:gap-6 font-montserrat ml-auto">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                className="text-theme-black font-medium font-montserrat whitespace-nowrap 2xl:text-md cursor-pointer max-w-[140px] overflow-hidden truncate"
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
              >
                <span className="truncate">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Desktop Button + Mobile Hamburger */}
          <div className="flex items-center gap-2 xl:gap-3">
            <Button
              asChild
              className="xl:flex hidden cursor-pointer bg-primary-color text-white px-3 py-3 xl:px-6 text-xs xl:text-sm shadow-md hover:bg-blue-900 !rounded-lg h-fit"
            >
              <a href="https://live-mosque-form.web.app/signup">
                <span className="hidden sm:inline">{headerButton.text}</span>
                <span className="sm:hidden">Register Your Masjid</span>
              </a>
            </Button>

            {/* Hamburger visible until xl */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex xl:hidden p-2 text-theme-black"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Backdrop (visible below xl) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer (visible below xl) */}
      <aside
        className={`fixed top-0 right-0 h-screen w-72 max-w-[85%] bg-white z-[70] shadow-xl transform transition-transform duration-300 xl:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              className="w-8 h-8 rounded-lg"
              width={32}
              height={32}
            />
            <span className="font-semibold text-sm text-theme-black">
              Live Mosque
            </span>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="p-1 text-theme-black"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-56px)]">
          <div className="grid gap-2">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.path}
                onClick={(e) => {
                  setOpen(false);
                  // Only handle smooth scrolling if it's a section link (starts with #)
                  if (link.path.startsWith("#") && link.path !== "#") {
                    e.preventDefault();
                    setTimeout(() => {
                      const element = document.querySelector(link.path);
                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }, 100); // Small delay to allow drawer to close
                  }
                }}
                className="text-sm text-theme-black font-medium py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer truncate"
              >
                {link.label}
              </a>
            ))}
          </div>

          <Button
            asChild
            className="w-full bg-primary-color text-white py-5 text-sm font-semibold shadow-md hover:bg-blue-900 !rounded-lg"
          >
            <a href="https://live-mosque-form.web.app/signup">
              {headerButton.text}
            </a>
          </Button>

          <div className="h-px bg-gray-200" />

          {/* Contact + Socials */}
          <div className="space-y-3 text-theme-black [&_svg]:w-4 [&_svg]:h-4">
            <div className="flex items-center gap-2">
              <span>
                <CallIcon />
              </span>
              <a
                href={`tel:${contactInfo.phone.replace(/[^\d]/g, "")}`}
                className="text-theme-black text-xs line-clamp-1"
              >
                {contactInfo.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <WhatsappIcon />
              </span>
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(
                  /[^\d]/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-theme-black text-xs line-clamp-1"
              >
                {contactInfo.whatsapp}
              </a>
            </div>
            <a
              href={`mailto:${contactInfo.email}`}
              onClick={handleMobileDrawerEmailClick}
              className="flex items-center gap-2 text-theme-black text-xs cursor-pointer max-w-full overflow-hidden whitespace-nowrap truncate"
            >
              <span>
                <MailIcon />
              </span>
              <span className="max-w-xl line-clamp-1">{contactInfo.email}</span>
            </a>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="inline-flex text-theme-black hover:opacity-80 transition-opacity"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </header>
  );
}
