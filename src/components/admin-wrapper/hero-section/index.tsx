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

interface IProps {
  data: ISection;
}

export default function HeroSection({ data }: IProps) {
  const { content, _id: sectionId, name } = data;
  const [emblaApi, setCarouselApi] = useState<CarouselApi>();
  const { handleSubmit, formData, loading, handleTriggerManageMedia } =
    useSection(
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
    let postData = {
      content: {
        ...content,
        //@ts-ignore
        data: Array.isArray(formData.content?.data)
          ? //@ts-ignore
            formData.content?.data
          : [],
      },
    };
    const files = e.target.files;
    if (!files || files.length === 0) return;
    //@ts-ignore
    const lastIndex = formData.content?.data?.length || 0;

    const file = files[0];

    const uploadMedia = { [`content.data[${lastIndex}]`]: file };
    const { uploaded: filePaths } = await handleTriggerManageMedia({
      uploadMedia: uploadMedia,
      deletedMedias: [],
    });

    const keys = Object.keys(uploadMedia);
    keys.forEach((k, idx) => {
      postData = setNestedValue(
        postData,
        k,
        {
          type: getMediaTypeFromPath(filePaths[idx]),
          url: filePaths[idx],
        },
        true
      );
    });
    await handleSubmit(postData);
    // 🧹 Step 4: Reset input so same file can be re-uploaded
    e.target.value = "";
    onDotButtonClick(lastIndex);
    console.log("✅ Uploaded file:", file);
  };

  const handleImageDelete = async () => {
    const postData = {
      content: formData.content,
    };
    //@ts-ignore
    const lastIndex = selectedIndex || 0;

    //@ts-ignore
    const filePath = formData.content?.data?.[lastIndex]?.url;

    await handleTriggerManageMedia({
      uploadMedia: {},
      deletedMedias: [filePath],
    });

    // @ts-ignore
    postData.content.data = postData.content.data.filter(
      (_: unknown, i: number) => i !== lastIndex
    );
    await handleSubmit(postData);
    if (selectedIndex === lastIndex) onDotButtonClick(0);
  };

  return (
    <SectionWrapper
      sectionId={sectionId}
      title={name}
      addButton
      onAdd={onAddHandler}
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
