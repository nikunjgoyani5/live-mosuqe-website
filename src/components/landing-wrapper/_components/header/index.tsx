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

const initialSocials = [
  {
    name: "Facebook",
    Icon: FacebookIcon,
    url: "https://facebook.com",
  },
  {
    name: "Instagram",
    Icon: InstagramIcon,
    url: "https://instagram.com",
  },
  {
    name: "LinkedIn",
    Icon: LinkedInIcon,
    url: "https://linkedin.com",
  },
  {
    name: "Twitter",
    Icon: TwitterIcon,
    url: "https://twitter.com",
  },
];

export default function Header({ data }: IProps) {
  const [open, setOpen] = useState(false);
  const [socials, setSocials] = useState(initialSocials);
  const [editingSocial, setEditingSocial] = useState<string | null>(null);

  const handleSocialUrlChange = (name: string, value: string) => {
    setSocials((prev) =>
      prev.map((social) =>
        social.name === name ? { ...social, url: value } : social
      )
    );
  };

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

  // Social links config
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/livemosque.live",
      Icon: FacebookIcon,
      enabled: true,
    },
    { name: "Instagram", href: "#", Icon: InstagramIcon, enabled: false },
    { name: "LinkedIn", href: "#", Icon: LinkedInIcon, enabled: false },
    {
      name: "Twitter",
      href: "https://x.com/livemosqueus",
      Icon: TwitterIcon,
      enabled: true,
    },
  ] as const;

  return (
    <header className="absolute top-0 left-0 xl:left-1/2 xl:-translate-x-1/2 container-1024 z-50 justify-between flex flex-col px-2 lg:px-4">
      {/* Top Bar */}
      <div className="hidden xl:flex text-white font-medium text-sm xl:text-base py-3 xl:py-4 justify-between items-center">
        {/* Left side: phone + whatsapp */}
        <div className="flex gap-4 xl:gap-6">
          <div className="flex items-center gap-2 text-sm">
            <CallIcon /> <span>{contactInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <WhatsappIcon /> <span>{contactInfo.whatsapp}</span>
          </div>
        </div>

        {/* Right side: socials + email */}
        <div className="flex cursor-pointer items-center gap-3 text-sm">
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
        <div className="flex items-center gap-4 xl:gap-6 text-sm">
          <div className="flex items-center gap-2">
            <MailIcon />
            <span>{contactInfo.email}</span>
          </div>
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
                className={`${
                  index === 0
                    ? "relative text-primary-color font-bold before:absolute before:-bottom-1 before:left-0 before:h-[3px] before:w-full before:bg-primary-color before:rounded-full whitespace-nowrap"
                    : "text-theme-black font-medium font-montserrat whitespace-nowrap"
                } 2xl:text-md`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Button + Mobile Hamburger */}
          <div className="flex items-center gap-2 xl:gap-3">
            <Button
              asChild
              className="inline-flex cursor-pointer bg-primary-color text-white px-3 py-3 xl:px-6 text-xs xl:text-sm shadow-md hover:bg-blue-900 !rounded-lg h-fit"
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
                onClick={() => setOpen(false)}
                className="text-sm text-theme-black font-medium py-2 px-3 rounded-md hover:bg-gray-100"
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
              <CallIcon />
              <a
                href={`tel:${contactInfo.phone.replace(/[^\d]/g, "")}`}
                className="text-theme-black text-xs"
              >
                {contactInfo.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <WhatsappIcon />
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(
                  /[^\d]/g,
                  ""
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-theme-black text-xs"
              >
                {contactInfo.whatsapp}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon />
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-theme-black text-xs"
              >
                {contactInfo.email}
              </a>
            </div>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map(({ name, href, Icon, enabled }) =>
                enabled ? (
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
                ) : (
                  <span
                    key={name}
                    aria-label={`${name} (coming soon)`}
                    title={`${name} (coming soon)`}
                    className="inline-flex text-theme-black/80 opacity-60 cursor-not-allowed"
                  >
                    <Icon />
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </aside>
    </header>
  );
}
