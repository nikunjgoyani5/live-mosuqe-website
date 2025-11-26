"use client";
import Dropzone, { isVideo } from "@/components/ui/DropZone";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { ISection } from "@/constants/section.constants";
import SectionWrapper from "./_components/sectionWrapper";
import ImageUploadField from "./_components/ImageUploadField";
import { getFullImageUrl } from "@/lib/utils";

interface IProps {
  data: ISection;
}

export default function AboutSection({ data }: IProps) {
  const { content, _id: sectionId, name, visible = true } = data;
  const {
    handleSubmit,
    formData,
    loading,
    uploadMedia,
    addUploadMedia,
    markDeletedMedia,
    handleOnChange,
  } = useSection(
    {
      content: content,
    },
    sectionId
  );

  return (
    <SectionWrapper sectionId={sectionId} title={name} visible={visible}>
      <FormProvider
        onSubmit={(data) => {
          handleSubmit({
            content: {
              //@ts-ignore
              ...data?.content,
              //@ts-ignore
              media_url: formData?.content?.media_url,
            },
          });
        }}
        options={{
          defaultValues: formData,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          <div className="lg:col-span-1 space-y-4 flex-1">
            <TextInput name="content.title" label="Heading" />
            <TextInput name="content.subtitle" label="Sub heading" />
            <TextInput name="content.body1" label="Body 1" />
            <TextInput name="content.body2" label="Body 2" />
            <TextInput name="content.readmore" label="ReadMore" />
          </div>
          <div className="space-y-4 lg:col-span-1">
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
                      className="w-full h-auto max-h-[240px] sm:max-h-[360px] lg:max-h-[537px] object-contain rounded"
                      unoptimized
                      width={837}
                      height={500}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      style={{
                        borderRadius: "45px 0px 0px 45px",
                      }}
                    />
                  ) : (
                    <video
                      src={`${URL.createObjectURL(file)}`}
                      autoPlay
                      muted
                      loop
                      controls={false}
                      className="w-full h-auto max-h-[240px] sm:max-h-[360px] lg:max-h-[537px] object-contain rounded"
                      style={{
                        borderRadius: "45px 0px 0px 45px",
                      }}
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
                    src={`${getFullImageUrl(
                      (formData.content as Record<string, string>).media_url
                    )}`}
                    alt="Uploaded"
                    className="w-full h-auto max-h-[240px] sm:max-h-[360px] lg:max-h-[537px] object-contain rounded"
                    unoptimized
                    width={837}
                    height={500}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{
                      borderRadius: "45px 0px 0px 45px",
                    }}
                  />
                ) : (
                  <video
                    src={`${getFullImageUrl(
                      (formData.content as Record<string, string>).media_url
                    )}`}
                    autoPlay
                    muted
                    loop
                    controls={false}
                    className="w-full h-auto max-h-[240px] sm:max-h-[360px] lg:max-h-[537px] object-contain rounded"
                    style={{
                      borderRadius: "45px 0px 0px 45px",
                    }}
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
              // <Dropzone
              //   name="content.media_url"
              //   files={{}}
              //   onAddFile={addUploadMedia}
              //   onDeleteFile={(key, path) => {
              //     markDeletedMedia(key, path);
              //     // else remove from uploadMedia directly if needed
              //   }}
              //   variant="both"
              //   existingFiles={[]}
              // />
              <ImageUploadField
                name="content.media_url"
                files={{}}
                uploadMedia={uploadMedia}
                existingImagePath={null}
                addUploadMedia={addUploadMedia}
                onDeleteFile={(key, path) => {
                  markDeletedMedia(key, path);
                  handleOnChange(key, "");
                }}
                aspectRatio="w-full h-[240px] sm:h-[360px] lg:h-[537px] object-contain rounded"
                existingFiles={[]}
                markDeletedMedia={function (
                  name: string,
                  pathToDelete: string
                ): void {
                  markDeletedMedia(name, pathToDelete);
                }}
                variant="both"
                targetHeight={537}
                targetWidth={810}
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
