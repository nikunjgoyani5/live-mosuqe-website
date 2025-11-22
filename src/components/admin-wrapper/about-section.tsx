"use client";
import Dropzone, { isVideo } from "@/components/ui/DropZone";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import { Trash2 } from "lucide-react";
import SelectInput from "../ui/forms/SelectInput";
import { BASE_URL } from "@/lib/axios";
import Image from "next/image";
import { ISection } from "@/constants/section.constants";
import SectionWrapper from "./_components/sectionWrapper";

interface IProps {
  data: ISection;
}

export default function AboutSection({ data }: IProps) {
  const { content, _id: sectionId, name } = data;
  const {
    handleSubmit,
    formData,
    loading,
    uploadMedia,
    addUploadMedia,
    markDeletedMedia,
  } = useSection(
    {
      content: content,
    },
    sectionId
  );
  console.log("data", content);

  return (
    <SectionWrapper sectionId={sectionId} title={name}>
      <FormProvider
        onSubmit={handleSubmit}
        options={{
          defaultValues: formData,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-x-5">
          <div className="lg:col-span-2 space-y-4">
            <TextInput name="content.title" label="Heading" />
            <TextInput name="content.subtitle" label="Sub heading" />
            <TextInput name="content.body1" label="Body 1" />
            <TextInput name="content.body2" label="Body 2" />
            <TextInput name="content.readmore" label="ReadMore" />
          </div>
          <div className="space-y-4">
            <TextInput name="content.main" label="Main" />
            <TextInput name="content.main_subtitle" label="Sub main" />
            {/* <SelectInput
              name="content.media_type"
              label="Media type"
              options={[
                { label: "Image", value: "image" },
                { label: "Video", value: "video" },
              ]}
            /> */}
            {Object.keys(uploadMedia).length > 0 ? (
              // 1️⃣ Show previews for newly selected files
              Object.entries(uploadMedia).map(([key, file]: [string, File]) => (
                <div key={key} className="relative">
                  {!isVideo(file) ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-[300] sm:h-[400] lg:h-[500] object-cover rounded"
                      unoptimized
                      width={500}
                      height={500}
                    />
                  ) : (
                    <video
                      src={`${URL.createObjectURL(file)}`}
                      autoPlay
                      muted
                      loop
                      controls={false}
                      className="w-full h-[300] sm:h-[400] lg:h-[500] object-cover rounded"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markDeletedMedia("content.media_url", "");
                    }}
                    className="absolute bottom-2 right-2 bg-white rounded p-2 shadow hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))
            ) : (formData.content as Record<string, string>)?.media_url ? (
              <div className="relative">
                {!isVideo(
                  (formData.content as Record<string, string>).media_url
                ) ? (
                  <Image
                    src={`${BASE_URL}${
                      (formData.content as Record<string, string>).media_url
                    }`}
                    alt="Uploaded"
                    className="w-full h-[300] sm:h-[400] lg:h-[500] object-cover rounded"
                    unoptimized
                    width={500}
                    height={500}
                  />
                ) : (
                  <video
                    src={`${BASE_URL}${
                      (formData.content as Record<string, string>).media_url
                    }`}
                    autoPlay
                    muted
                    loop
                    controls={false}
                    className="w-full h-[300] sm:h-[400] lg:h-[500] object-cover rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    markDeletedMedia(
                      "content.media_url",
                      (formData.content as Record<string, string>).media_url
                    );
                  }}
                  className="absolute bottom-2 right-2 bg-white rounded p-2 shadow hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ) : (
              // 3️⃣ Nothing there yet → show Dropzone
              <Dropzone
                name="content.media_url"
                files={{}}
                onAddFile={addUploadMedia}
                onDeleteFile={(key, path) => {
                  markDeletedMedia(key, path);
                  // else remove from uploadMedia directly if needed
                }}
                variant="both"
                existingFiles={[]}
              />
            )}
          </div>
        </div>

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
