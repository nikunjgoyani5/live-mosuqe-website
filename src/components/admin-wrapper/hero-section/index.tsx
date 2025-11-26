"use client";
import { setNestedValue, useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import { ISection } from "@/constants/section.constants";
import SectionWrapper from "../_components/sectionWrapper";
import TextInput from "@/components/ui/forms/TextInput";
import SliderHeroForm from "./slider-hero";
import "./index.css";
import { useState } from "react";
import { CarouselApi } from "@/components/ui/carousel";
import { useDotButton } from "./useDotButton";
import { getMediaTypeFromPath } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

interface IProps {
  data: ISection;
}

export default function HeroSection({ data }: IProps) {
  const { content, _id: sectionId, name, visible } = data;
  const [emblaApi, setCarouselApi] = useState<CarouselApi>();
  const {
    handleSubmit,
    formData,
    loading,
    handleTriggerManageMedia,
    handleOnChange,
    markDeletedMedia,
  } = useSection(
    {
      content: content,
    },
    sectionId
  );
  const { selectedIndex, onDotButtonClick } = useDotButton(emblaApi);

  const onAddHandler = () => {
    const fileInput = document.getElementById("upload-hero");
    fileInput?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      let postData = {
        content: {
          ...content,
          //@ts-ignore
          data: Array.isArray(content?.data)
            ? //@ts-ignore
              content?.data
            : [],
        },
      };

      const files = e.target.files;
      if (!files || files.length === 0) return;

      //@ts-ignore
      const lastIndex = formData.content?.data?.length || 0;
      const file = files[0];

      // ✅ Step 1: Compress the image if it's an image type
      let finalFile = file;
      if (file.type.startsWith("image/")) {
        try {
          const options = {
            maxSizeMB: 1, // target ~1MB
            maxWidthOrHeight: 1920, // resize large images
            useWebWorker: true,
          };
          finalFile = await imageCompression(file, options);
          console.log(
            `📦 Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(
              finalFile.size /
              1024 /
              1024
            ).toFixed(2)}MB`
          );
        } catch (err) {
          console.error("❌ Image compression failed:", err);
        }
      }

      const uploadMedia = { [`content.data[${lastIndex}]`]: finalFile };
      const { uploaded: filePaths } = await handleTriggerManageMedia({
        uploadMedia,
        deletedMedias: [],
      });

      if (filePaths.length) {
        const keys = Object.keys(uploadMedia);
        keys.forEach((k, idx) => {
          if (filePaths[idx]) {
            postData = setNestedValue(
              postData,
              k,
              {
                type: getMediaTypeFromPath(filePaths[idx]),
                url: filePaths[idx],
              },
              true
            );
          }
        });
      }

      await handleSubmit(postData);
      e.target.value = "";
      onDotButtonClick(lastIndex);
      console.log("✅ Uploaded file:", finalFile);
    } catch (err: any) {
      toast.error(err?.message || "Image upload failed, please try again!");
    }
  };

  const handleImageDelete = async () => {
    //@ts-ignore
    const lastIndex = selectedIndex || 0;

    //@ts-ignore
    const filePath: string = formData.content?.data?.[lastIndex]?.url;

    if (filePath) {
      markDeletedMedia("deletePath", filePath, false);
      // @ts-ignore
      const newArr = formData.content.data.filter(
        (_: unknown, i: number) => i !== lastIndex
      );

      handleOnChange("content.data", newArr);
      if (selectedIndex === lastIndex) onDotButtonClick(0);
    }
  };

  return (
    <SectionWrapper
      sectionId={sectionId}
      title={name}
      addButton
      onAdd={onAddHandler}
      visible={visible}
    >
      <input
        type="file"
        hidden
        id="upload-hero"
        accept="image/*,video/*"
        onChange={handleImageUpload}
      />
      <FormProvider
        onSubmit={(values) => {
          handleSubmit({
            content: {
              //@ts-ignore
              ...values?.content,
              //@ts-ignore
              data: Array.isArray(formData.content?.data)
                ? //@ts-ignore
                  formData.content?.data
                : [],
            },
          });
        }}
        options={{
          defaultValues: formData,
        }}
      >
        <SliderHeroForm
          onDelete={handleImageDelete}
          setCarouselApi={setCarouselApi}
          data={
            //@ts-ignore
            Array.isArray(formData.content?.data) ? formData.content?.data : []
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <TextInput name="content.hero_title" label="Hero title" />
          <TextInput name="content.hero_subtitle" label="Sub title" />
        </div>
        <StateButton
          loading={loading}
          type="submit"
          className="mt-4"
          disabled={loading}
          id="save-hero-section"
        >
          Save
        </StateButton>
      </FormProvider>
    </SectionWrapper>
  );
}
