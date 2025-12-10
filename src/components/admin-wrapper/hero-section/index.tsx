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
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { selectedIndex, onDotButtonClick } = useDotButton(emblaApi);

  const onAddHandler = () => {
    const fileInput = document.getElementById("upload-hero");
    fileInput?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const filesUp = e.target.files;
      if (!filesUp || filesUp.length === 0) return;

      //@ts-ignore
      const file = filesUp[0];

      // ✅ Step 1: Compress the image if it's an image type
      let finalFile = file;
      if (file.type.startsWith("image/")) {
        try {
          const options = {
            maxSizeMB: 10, // target ~10MB
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

      // Validate MIME type
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/avi",
        "video/mov",
      ];
      if (!allowedMimeTypes.includes(file.type)) {
        throw new Error(
          "Unsupported file format. Please upload a JPEG, PNG, GIF, MP4, AVI, or MOV."
        );
      }

      // Validate file size (e.g., max 10MB)
      const maxSizeInMB = 10;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        throw new Error(
          `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`
        );
      }

      const fileData = {
        file: finalFile,
        url: URL.createObjectURL(finalFile), // Generate a preview URL for the file
        name: finalFile.name,
        timestamp: Date.now(), // Add a timestamp for sorting
        type: finalFile.type.startsWith("image/") ? "image" : "video", // Determine if the file is an image or video
      };
      const newFiles = [...files, fileData];
      //@ts-ignore
      setFiles(newFiles);
      setTimeout(() => {
        //@ts-ignore
        onDotButtonClick([...newFiles, ...formData.content?.data]?.length - 1);
      }, 700);
    } catch (err: any) {
      toast.error(err?.message || "Image upload failed, please try again!");
    }
  };

  const handleImageDelete = async () => {
    //@ts-ignore
    const lastIndex = selectedIndex || 0;

    //@ts-ignore
    if (lastIndex > formData.content?.data?.length - 1) {
      //@ts-ignore
      const removeIndex = lastIndex - formData.content?.data?.length;
      //@ts-ignore
      setFiles((prevFiles: any[]) =>
        prevFiles.filter((_, i) => i !== removeIndex)
      );
    } else {
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
    }
  };

  const handleSubmitHandler = async (values: any) => {
    setIsLoading(true);
    try {
      //@ts-ignore
      const bannerPaths = Array.isArray(formData.content?.data)
        ? //@ts-ignore
          formData.content?.data
        : [];

      // Sort files by timestamp before mapping
      const sortedFiles = [...files].sort(
        (a: any, b: any) => a.timestamp - b.timestamp
      );

      // map for uploadMedia
      const mapFiles = sortedFiles.reduce(
        (acc: any, fileData: any, index: number) => {
          acc[`content.data[${fileData.name + index}]`] = fileData.file;
          return acc;
        },
        {}
      );

      const { uploaded: filePaths } = await handleTriggerManageMedia({
        uploadMedia: mapFiles,
        deletedMedias: [],
      });

      if (filePaths.length) {
        bannerPaths.push(
          ...filePaths?.map((path) => ({
            type: getMediaTypeFromPath(path),
            url: path,
          }))
        );
      }

      await handleSubmit({
        content: {
          //@ts-ignore
          ...values?.content,
          //@ts-ignore
          data: bannerPaths,
        },
      });
      setFiles([]);
    } catch (e) {
      console.log("error");
    } finally {
      setIsLoading(false);
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
        onSubmit={handleSubmitHandler}
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
          uploadedMedias={files}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <TextInput name="content.hero_title" label="Hero title" />
          <TextInput name="content.hero_subtitle" label="Sub title" />
        </div>
        <StateButton
          loading={loading || isLoading}
          type="submit"
          className="mt-4"
          disabled={loading || isLoading}
          id="save-hero-section"
        >
          Save
        </StateButton>
      </FormProvider>
    </SectionWrapper>
  );
}
