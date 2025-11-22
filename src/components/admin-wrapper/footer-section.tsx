"use client";
import Dropzone from "@/components/ui/DropZone";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { IMenu, IOption, ISection } from "@/constants/section.constants";
import SectionWrapper from "./_components/sectionWrapper";
import { GoPlus } from "react-icons/go";
import CreatableSelectInput from "../ui/forms/CreatableSelectInput";
import EditableSocialIcons from "./_components/EditableSocialLink";

interface IProps {
  data: ISection;
  pathOptions?: IOption[];
}

const MenuItems = ({ options = [] }: { options: IOption[] }) => {
  const { watch, setValue } = useFormContext();
  const [activeMenu, setActiveMenu] = useState<number | null>(0);

  const data = watch("content.data") || [];

  // remove item at index
  const removeItem = (index: number) => {
    const updated: IOption[] = data.filter(
      (_: IOption, i: number) => i !== index
    );
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
            className="px-3 py-3 border rounded cursor-pointer"
            type="button"
            onClick={() => {
              addItem();
            }}
          >
            <GoPlus />
          </button>
        </div>
      )}
      {Array.isArray(data) &&
        data.length > 0 &&
        data.map((_: IMenu, i: number) => i === activeMenu && showNewEdit(i))}
    </>
  );
};

export default function FooterSection({ data, pathOptions = [] }: IProps) {
  const { content, _id: sectionId, name } = data;
  const {
    handleSubmit,
    formData,
    loading,
    addUploadMedia,
    markDeletedMedia,
    uploadMedia,
  } = useSection(
    {
      content: content,
    },
    sectionId
  );

  if (content && (content as any).info && !(content as any).info.socials) {
    (content as any).info.socials = [
      { name: "Facebook", url: "https://facebook.com" },
      { name: "Twitter", url: "https://twitter.com" },
    ];
  }

  return (
    <SectionWrapper sectionId={sectionId} title={name}>
      <FormProvider
        onSubmit={handleSubmit}
        options={{
          defaultValues: formData,
        }}
      >
        <MenuItems options={pathOptions} />
        {/* <div className="w-full flex"> */}
        {/* <div className="w-1/2">
            <Dropzone
              name="content.image"
              files={uploadMedia}
              onAddFile={addUploadMedia}
              onDeleteFile={(key, path) => {
                if (path) markDeletedMedia(key, path);
                else {
                  // remove from uploadMedia directly
                  // you can implement removeUploadMedia in hook
                }
              }}
              variant="image"
              existingFiles={
                (formData.content as Record<string, string>)?.image
                  ? [
                      {
                        path: (formData.content as Record<string, string>)
                          .image,
                        key: "content.image",
                      },
                    ]
                  : []
              }
            />
          </div> */}
        {/* <EditableSocialIcons />
        </div>
        <br /> */}
        <TextInput name="content.copyright" label="Copyright" />
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
