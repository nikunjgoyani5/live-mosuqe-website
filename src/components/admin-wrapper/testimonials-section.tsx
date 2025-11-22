"use client";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import { ReactNode, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import SectionWrapper from "./_components/sectionWrapper";
import { X } from "lucide-react";
import TextareaField from "../ui/forms/TextareaField";
import CheckboxInput from "../ui/forms/CheckboxInput";
import { IBlog, ISection, ITestimonial } from "@/constants/section.constants";
import Image from "next/image";
import { BASE_URL } from "@/lib/axios";
import { formatDate, generateObjectWithUID, generateUID } from "@/lib/utils";
import { useSectionData } from "@/hooks/useSectionData";
import ImageUploadField from "./_components/ImageUploadField";
import { FormResetter } from "./_components/FormReseter";
import ImagePreview from "./_components/ImagePriview";

interface IProps {
  data: ISection;
}

const intialData = {
  name: "Ahmad Faisal",
  text: "This is an amazing App, by far the best one in the market. As an Imam my experience is that it made every musullin's life 100 times easier...",
  rating: "4.1",
  location: "Ahmad Faisal, New Yorkv",
};

const MenuItems = ({
  content,
  imageUpload,
  uploadMedia,
  markDeletedMedia,
  onDelete,
}: {
  content: any[];
  imageUpload: (index: number, val: object) => ReactNode;
  uploadMedia: object;
  markDeletedMedia: (path: string) => void;
  onDelete: (val: string) => void;
}) => {
  const { watch, setValue } = useFormContext();
  const [activeMenu, setActiveMenu] = useState<number | null>(0);

  const data = content || [];
  const dataForm = watch("content.data") || [];

  // remove item at index
  const removeItem = (id: string) => {
    const itemToRemove = dataForm.find((val: any) => val.id === id);
    if (itemToRemove && itemToRemove.image) {
      markDeletedMedia(itemToRemove.image);
    }
    onDelete(id);

    const updated = dataForm.filter((val: any) => val.id !== id);
    console.log("updated", updated, id);
    setValue("content.data", updated, { shouldDirty: true });
  };

  const showNewEdit = (index: number) => (
    <div key={index}>
      <label className="text-lg font-medium mb-2 block">
        Edit Testimonials
      </label>
      <div>{imageUpload(index, uploadMedia)}</div>
      <TextInput name={`content.data.${index}.name`} label="Name" />
      <TextInput name={`content.data.${index}.text`} label="Text" />
      <TextInput name={`content.data.${index}.rating`} label="Rating" />
      <TextInput name={`content.data.${index}.location`} label="Location" />
    </div>
  );

  return (
    <>
      {Array.isArray(data) &&
        data.length > 0 &&
        data.map(
          (_: ITestimonial, i: number) => i === activeMenu && showNewEdit(i)
        )}
      {Array.isArray(data) && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
          {data.map((item: ITestimonial, i: number) => (
            <div
              key={i}
              className={`relative group px-2 py-1 cursor-pointer card flex items-start gap-4 ${
                i === activeMenu ? "border !border-primary-color" : ""
              }`}
              onClick={() => setActiveMenu(i)}
            >
              {item.image ? (
                <ImagePreview
                  url={`${BASE_URL}${item.image}`}
                  className="w-12 h-12 min-w-12 min-h-12 object-contain rounded"
                />
              ) : (
                <div className="w-12 h-12 min-w-12 min-h-12 object-contain rounded bg-gray-400/10" />
              )}
              <div>
                <div className="text-sm font-medium mb-1">{item.name}</div>
                <div className="text-xs text-gray-600 mb-1 line-clamp-2">
                  {item.text}
                </div>
                <div className="text-xs text-yellow-500 mb-1">
                  ★ {item.rating}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {item.location}
                </div>
              </div>
              {/* Close icon on hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // avoid triggering onClick
                  removeItem(item.id);
                  if (i === activeMenu) setActiveMenu(0);
                }}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default function ServiceSection({ data }: IProps) {
  const {
    content,
    _id: sectionId,
    name,
    refetch,
    visible,
  } = useSectionData(data);
  const [deletedCards, setDeletedCards] = useState<string[]>([]);
  const {
    handleSubmit,
    formData,
    loading,
    uploadMedia,
    markDeletedMedia,
    addUploadMedia,
  } = useSection(
    {
      content: content,
    },
    sectionId,
    async () => {
      refetch && (await refetch());
      setDeletedCards([]);
    }
  );

  // add item at index
  const addItem = async () => {
    //@ts-ignore
    const newData = [
      //@ts-ignore
      ...content?.data,
      { ...intialData, ...generateObjectWithUID() },
    ];
    await handleSubmit({ content: { ...content, data: newData } });
  };

  const imageUploadSection = (index: number, media: object) => {
    const fieldName = `content.data[${index}].image`;
    // @ts-ignore
    const existingPath = formData.content?.data?.[index]?.image;
    return (
      <ImageUploadField
        name={fieldName}
        uploadMedia={uploadMedia}
        existingImagePath={existingPath}
        addUploadMedia={addUploadMedia}
        markDeletedMedia={markDeletedMedia}
        aspectRatio="w-[100px] h-[100px] sm:h-[100px] lg:h-[100px] object-contain rounded min-h-auto"
        files={{}}
        onDeleteFile={markDeletedMedia}
        onlyIcon
      />
    );
  };

  return (
    <SectionWrapper
      sectionId={sectionId}
      title={name}
      addButton
      onAdd={addItem}
      visible={visible}
    >
      <FormProvider
        onSubmit={(values) => {
          const newData = [
            //@ts-ignore
            ...values?.content?.data,
          ].filter((val) => !deletedCards.includes(val.id));
          //@ts-ignore
          formData.content?.data?.forEach((value) => {
            const dataIndex = newData.findIndex((val) => val.id === value.id);
            if (dataIndex !== -1) newData[dataIndex].image = value.image;
          });
          handleSubmit({
            content: { ...(values?.content || {}), data: newData },
          });
        }}
        options={{
          defaultValues: formData,
        }}
      >
        <FormResetter data={formData} />
        <TextInput name="content.title" label="Heading" />
        <MenuItems
          imageUpload={(index: number, val: object) =>
            imageUploadSection(index, val)
          }
          uploadMedia={uploadMedia}
          markDeletedMedia={markDeletedMedia}
          onDelete={(val) => {
            setDeletedCards((prev) => [...prev, val]);
          }}
          //@ts-ignore
          content={
            //@ts-ignore
            content?.data.filter((val) => !deletedCards.includes(val?.id)) || []
          }
        />

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
