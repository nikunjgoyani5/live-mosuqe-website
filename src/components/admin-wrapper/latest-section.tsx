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
import { IBlog, ISection } from "@/constants/section.constants";
import Image from "next/image";
import {
  formatDate,
  generateObjectWithUID,
  generateUID,
  getFullImageUrl,
} from "@/lib/utils";
import { useSectionData } from "@/hooks/useSectionData";
import ImageUploadField from "./_components/ImageUploadField";
import ImageGuidelines from "../_landing-components/image-guidelines";

interface IProps {
  data: ISection;
}

const intialData = {
  title: "New Blog Post",
  subtitle: "New Blog Post Subtitle",
  postdate: new Date().toISOString().split("T")[0],
  isFeatured: false,
};

const FormResetter = ({ data }: { data: any }) => {
  const { reset } = useFormContext();

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  return null; // This component doesn't render anything
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
    const updated = dataForm.filter((val: any) => val.id !== id);
    setValue("content.data", updated, { shouldDirty: true });
    onDelete(id);
  };

  const showNewEdit = (index: number) => (
    <div
      key={index}
      className="flex flex-col lg:flex-row md:grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5"
    >
      <div>{imageUpload(index, uploadMedia)}</div>
      <div className="lg:col-span-2 space-y-4 flex-1">
        <TextInput name={`content.data.${index}.title`} label="Title" />
        {/* <TextInput name={`content.data.${index}.read_more`} label="Read More" /> */}
        <div className="lg:col-span-2">
          <TextareaField
            name={`content.data.${index}.subtitle`}
            label="Sub title"
          />
          <br />
          <CheckboxInput
            name={`content.data.${index}.isFeatured`}
            label="Is Featured"
            required={false}
          />
        </div>
        <TextInput
          name={`content.data.${index}.postdate`}
          label="Post date"
          type="date"
        />
      </div>
    </div>
  );

  return (
    <>
      {Array.isArray(data) &&
        data.length > 0 &&
        data.map((_: IBlog, i: number) => i === activeMenu && showNewEdit(i))}
      {Array.isArray(data) && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
          {data.map((item: IBlog, i: number) => (
            <div
              key={i}
              className={`relative group px-2 py-1 cursor-pointer card flex gap-5 items-center  ${
                i === activeMenu ? "!border-primary-color" : ""
              }`}
              onClick={() => setActiveMenu(i)}
            >
              {item.image ? (
                <Image
                  src={`${getFullImageUrl(item.image)}`}
                  alt={item.title}
                  width={145}
                  height={155}
                  className="w-24 h-24 min-w-24 min-h-24 object-contain rounded"
                />
              ) : (
                <div className="w-24 h-24 min-w-24 min-h-24 object-contain rounded bg-gray-400/10" />
              )}
              <div className="overflow-hidden text-ellipsis">
                <div className="text-sm font-medium mb-1 truncate line-clamp-1 text-ellipsis w-full overflow-hidden">
                  {item.title}
                </div>
                <div className="text-xs text-gray-600 mb-1 line-clamp-2 text-ellipsis w-full overflow-hidden">
                  {item.subtitle}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(item.postdate)}
                </div>
                {/* <div className="text-xs text-blue-500 truncate">
                  {item.read_more}
                </div> */}
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

export default function LatestNewsSection({ data }: IProps) {
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
    await handleSubmit({ content: { data: newData } });
  };

  const imageUploadSection = (index: number, media: object) => {
    const fieldName = `content.data[${index}].image`;
    // @ts-ignore
    const existingPath = formData.content?.data?.[index]?.image;
    return (
      <>
        <ImageUploadField
          name={fieldName}
          uploadMedia={uploadMedia}
          existingImagePath={existingPath}
          addUploadMedia={addUploadMedia}
          markDeletedMedia={markDeletedMedia}
          aspectRatio="w-full sm:min-w-[645px] h-[150] sm:h-[555] lg:h-[555] object-contain rounded"
          files={{}}
          onDeleteFile={markDeletedMedia}
          targetHeight={555}
          targetWidth={645}
          skipTool={true}
        />
      </>
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

          handleSubmit({ content: { ...content, data: newData } });
        }}
        options={{
          defaultValues: formData,
        }}
      >
        <FormResetter data={formData} />

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
