"use client";
import Dropzone, { isVideo } from "@/components/ui/DropZone";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { ISection } from "@/constants/section.constants";
import TextareaField from "@/components/ui/forms/TextareaField";
import SectionWrapper from "./_components/sectionWrapper";
import ImageUploadField from "./_components/ImageUploadField";
import { getFullImageUrl } from "@/lib/utils";

interface IProps {
  data: ISection;
}

export default function DonationPageSection({ data }: IProps) {
  const { content, _id: sectionId, name, visible } = data;
  const {
    handleSubmit,
    formData,
    loading,
    uploadMedia,
    addUploadMedia,
    markDeletedMedia,
    handleSubmitMedias,
    handleOnChange,
  } = useSection(
    {
      content: content,
    },
    sectionId
  );
  const uploadedCount =
    // @ts-ignore
    Object.keys(formData.content?.imagesData || {}).length || 0;
  const uploadMediaCount = Object.keys(uploadMedia)?.length;
  const markDeletedMediaCount = Object.keys(markDeletedMedia)?.length;

  const addCount = uploadedCount + uploadMediaCount - markDeletedMediaCount;
  return (
    <SectionWrapper sectionId={sectionId} title={name} visible={visible}>
      <FormProvider
        onSubmit={(value) => {
          handleSubmit({
            content: {
              //@ts-ignore
              ...value.content,
              //@ts-ignore
              imagesData: { ...formData.content?.imagesData },
              //@ts-ignore
              media_url: formData.content?.media_url,
            },
          });
        }}
        options={{
          defaultValues: formData,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-x-5">
          <div className="lg:col-span-1 space-y-4">
            {Object.keys(uploadMedia).filter((v) => v === "content.media_url")
              .length > 0 ? (
              // 1️⃣ Show previews for newly selected files
              Object.entries(uploadMedia).map(
                ([key, file]: [string, File]) =>
                  key === "content.media_url" && (
                    <div key={key} className="relative">
                      {!isVideo(file) ? (
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-[300] sm:h-[400] lg:h-[400] object-contain rounded"
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
                          className="w-full h-[300] sm:h-[400] lg:h-[400] object-contain rounded"
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
                  )
              )
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
                    className="w-full h-[300] sm:h-[400] lg:h-[400] object-contain rounded"
                    unoptimized
                    width={500}
                    height={500}
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
                    className="w-full h-[300] sm:h-[400] lg:h-[400] object-contain rounded"
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
              <ImageUploadField
                name="content.media_url"
                files={{}}
                uploadMedia={{}}
                existingImagePath={null}
                addUploadMedia={addUploadMedia}
                onDeleteFile={(key, path) => {
                  markDeletedMedia(key, path);
                  handleOnChange(key, "");
                }}
                existingFiles={[]}
                markDeletedMedia={function (
                  name: string,
                  pathToDelete: string
                ): void {
                  markDeletedMedia(name, pathToDelete);
                }}
                skipTool={true}
              />
            )}
          </div>
          <div className="lg:col-span-2 space-y-4">
            <TextInput name="content.label" label="Page Label" />
            <TextInput name="content.title" label="Heading" />
            <TextareaField name={`content.description`} label="Description" />
            <TextInput name="content.btnText" label="Button Text" />
            <TextInput name="content.path" label="Path" />
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
