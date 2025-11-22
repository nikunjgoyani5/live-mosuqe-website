"use client";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import SectionWrapper from "./_components/sectionWrapper";
import { LuPhoneCall } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { X } from "lucide-react";
import { GoPlus } from "react-icons/go";
import { IMenu, IOption, ISection } from "@/constants/section.constants";
import CreatableSelectInput from "../ui/forms/CreatableSelectInput";
import Image from "next/image";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/constants/icons";
import EditableSocialIcons from "./_components/EditableSocialLink";

interface IProps {
  data: ISection;
  pathOptions: IOption[];
}

const MenuItems = ({ options = [] }: { options: IOption[] }) => {
  const { watch, setValue } = useFormContext();
  const [activeMenu, setActiveMenu] = useState<number | null>(0);

  const data = watch("content.data") || [];

  // remove item at index
  const removeItem = (index: number) => {
    const updated = data.filter((_: IMenu, i: number) => i !== index);
    setValue("content.data", updated, { shouldDirty: true });
    if (activeMenu === index) setActiveMenu(0);
  };

  // add item at index
  const addItem = () => {
    const updated = [
      ...data,
      { label: "Menu " + data.length, path: "Menu-" + data.length },
    ];
    setValue("content.data", updated, { shouldDirty: true });
    setActiveMenu(updated.length - 1);
  };

  const showNewEdit = (index: number) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
      <TextInput name={`content.data.${index}.label`} label="Menu name" />
      <CreatableSelectInput
        name={`content.data.${index}.path`}
        label="Menu path"
        placeholder="Add or select path"
        options={options}
      />
    </div>
  );

  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-5">
            <Image
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 xl:w-14 xl:h-14 rounded-lg"
              width={70}
              height={70}
            />
          </div>
          <div className="w-full lg:w-auto">
            {Array.isArray(data) && data.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {data.map((item: IMenu, i: number) => (
                  <div
                    key={i}
                    className={`relative group px-2 py-1 cursor-pointer ${
                      i === activeMenu ? "font-bold" : ""
                    }`}
                    onClick={() => setActiveMenu(i)}
                  >
                    {item.label || `Menu ${i + 1}`}
                    {/* Close icon on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // avoid triggering onClick
                        removeItem(i);
                      }}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  className="px-3 py-3 border rounded"
                  type="button"
                  onClick={() => {
                    addItem();
                  }}
                >
                  <GoPlus />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <StateButton type="button" className="text-sm sm:text-base">
              Register Your Masjid
            </StateButton>
          </div>
        </div>
      </div>

      {Array.isArray(data) &&
        data.length > 0 &&
        data.map((_: IMenu, i: number) => (
          <div key={i}>{i === activeMenu && showNewEdit(i)}</div>
        ))}
    </>
  );
};

export default function HeaderSection({ data, pathOptions = [] }: IProps) {
  const { content, _id: sectionId, name } = data;

  if (content && (content as any).info && !(content as any).info.socials) {
    (content as any).info.socials = [
      { name: "Facebook", url: "https://facebook.com" },
      { name: "Twitter", url: "https://twitter.com" },
    ];
  }

  const { handleSubmit, formData, loading } = useSection(
    {
      content: content,
    },
    sectionId
  );

  return (
    <SectionWrapper sectionId={sectionId} title={name}>
      <FormProvider
        onSubmit={handleSubmit}
        options={{
          defaultValues: formData,
        }}
      >
        <div>
          <label className="section-label">Header Logo + Menu</label>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full lg:w-auto">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <LuPhoneCall className="" size="25" />
                <TextInput name="content.info.phone" />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <FaWhatsapp className="" size="25" />
                <TextInput name="content.info.whatsapp" />
              </div>
            </div>
            <div className="flex cursor-pointer items-center gap-3 text-sm">
              <EditableSocialIcons />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <MdOutlineMailOutline className="" size="25" />
              <TextInput name="content.info.email" />
            </div>
          </div>
        </div>
        <hr />

        <MenuItems options={pathOptions} />

        <StateButton
          loading={loading}
          type="submit"
          className="mt-4"
          disabled={loading}
        >
          Save
        </StateButton>
      </FormProvider>
    </SectionWrapper>
  );
}
