"use client";
import Dropzone, { isVideo } from "@/components/ui/DropZone";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "@/lib/axios";
import Image from "next/image";
import { ISection } from "@/constants/section.constants";
import SectionWrapper from "../_components/sectionWrapper";
import TextareaField from "@/components/ui/forms/TextareaField";
import DownloadVariantsForm from "./download-variants-form";
import ProductVariantsForm from "./product-variants-form";

interface IProps {
  data: ISection;
}

export default function ProductsSection({ data }: IProps) {
  const { content, _id: sectionId, name } = data;
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
    <SectionWrapper sectionId={sectionId} title={name}>
      <FormProvider
        onSubmit={(value) => {
          handleSubmit({
            content: {
              //@ts-ignore
              ...value.content,
              //@ts-ignore
              imagesData: { ...formData.content?.imagesData },
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
                          className="w-full h-[300] sm:h-[400] lg:h-[400] object-cover rounded"
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
                          className="w-full h-[300] sm:h-[400] lg:h-[400] object-cover rounded"
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
                    src={`${BASE_URL}${
                      (formData.content as Record<string, string>).media_url
                    }`}
                    alt="Uploaded"
                    className="w-full h-[300] sm:h-[400] lg:h-[400] object-cover rounded"
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
                    className="w-full h-[300] sm:h-[400] lg:h-[400] object-cover rounded"
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
                }}
                existingFiles={[]}
              />
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {(formData.content as Record<string, string[]>)?.imagesData
                ? Object.entries(
                    (formData.content as Record<string, string[]>)?.imagesData
                  )?.map(
                    ([key, val], i) =>
                      val && (
                        <div className="relative">
                          {!isVideo(val) ? (
                            <Image
                              src={`${BASE_URL}${val}`}
                              alt="Uploaded"
                              className="w-[100] h-[100] sm:h-[100] lg:h-[100] object-cover rounded"
                              unoptimized
                              width={500}
                              height={500}
                            />
                          ) : (
                            <video
                              src={`${BASE_URL}${val}`}
                              autoPlay
                              muted
                              loop
                              controls={false}
                              className="w-[100] h-[100] sm:h-[100] lg:h-[100] object-cover rounded"
                            />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markDeletedMedia(key, val);
                              handleOnChange("content.imagesData", {
                                //@ts-ignore
                                ...formData.content?.imagesData,
                                //@ts-ignore
                                ...(formData.content?.imagesData && {
                                  [key]: "",
                                }),
                              });
                            }}
                            className="absolute bottom-2 right-2 bg-white rounded p-2 shadow hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )
                  )
                : null}
              {Object.keys(uploadMedia).length > 0
                ? // 1️⃣ Show previews for newly selected files
                  Object.entries(uploadMedia).map(
                    ([key, file]: [string, File]) =>
                      key !== "content.media_url" &&
                      key.startsWith("content.imagesData") &&
                      File && (
                        <div key={key} className="relative">
                          {!isVideo(file) ? (
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-[100] h-[100] sm:h-[100] lg:h-[100] object-cover rounded"
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
                              className="w-[100] h-[100] sm:h-[100] lg:h-[100] object-cover rounded"
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
                : null}
              {/* // 3️⃣ Nothing there yet → show Dropzone */}
              <div className="w-[250] h-[100] sm:h-[100] lg:h-[100] object-cover rounded">
                <Dropzone
                  name={`content.imagesData.Image${
                    addCount < 0 ? 0 : addCount
                  }`}
                  files={{}}
                  variant="image"
                  onAddFile={addUploadMedia}
                  onDeleteFile={(key, path) => {
                    markDeletedMedia(key, path);
                  }}
                  existingFiles={[]}
                  onlyIcon
                  className="!w-[100] !h-[100] min-h-[100] max-h-[100] min-w-[100] max-w-[100] bg-[#EDF0F2] border-solid"
                />
              </div>
            </div>
            <h5>Product Photos</h5>
            <div className="flex items-center gap-4 flex-wrap">
              {(formData.content as Record<string, string[]>)?.modalImages
                ? Object.entries(
                    (formData.content as Record<string, string[]>)?.modalImages
                  )?.map(
                    ([key, val], i) =>
                      val && (
                        <div className="relative">
                          {!isVideo(val) ? (
                            <Image
                              src={`${BASE_URL}${val}`}
                              alt="Uploaded"
                              className="w-[100] h-[100] sm:h-[100] lg:h-[100] object-cover rounded"
                              unoptimized
                              width={500}
                              height={500}
                            />
                          ) : (
                            <video
                              src={`${BASE_URL}${val}`}
                              autoPlay
                              muted
                              loop
                              controls={false}
                              className="w-[100] h-[100] sm:h-[100] lg:h-[100] object-cover rounded"
                            />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markDeletedMedia(key, val);
                              handleOnChange("content.modalImages", {
                                //@ts-ignore
                                ...formData.content?.modalImages,
                                //@ts-ignore
                                ...(formData.content?.modalImages && {
                                  [key]: "",
                                }),
                              });
                            }}
                            className="absolute bottom-2 right-2 bg-white rounded p-2 shadow hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )
                  )
                : null}
              {Object.keys(uploadMedia).length > 0
                ? // 1️⃣ Show previews for newly selected files
                  Object.entries(uploadMedia).map(
                    ([key, file]: [string, File]) =>
                      key !== "content.media_url" &&
                      key.startsWith("content.modalImages") &&
                      File && (
                        <div key={key} className="relative">
                          {!isVideo(file) ? (
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-[100] h-[100] sm:h-[100] lg:h-[100] object-cover rounded"
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
                              className="w-[100] h-[100] sm:h-[100] lg:h-[100] object-cover rounded"
                            />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markDeletedMedia("content.modalImages", "");
                            }}
                            className="absolute bottom-2 right-2 bg-white rounded p-2 shadow hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )
                  )
                : null}
              {/* // 3️⃣ Nothing there yet → show Dropzone */}
              <div className="w-[250] h-[100] sm:h-[100] lg:h-[100] object-cover rounded">
                <Dropzone
                  name={`content.modalImages.Image${
                    addCount < 0 ? 0 : addCount
                  }`}
                  files={{}}
                  variant="image"
                  onAddFile={addUploadMedia}
                  onDeleteFile={(key, path) => {
                    markDeletedMedia(key, path);
                  }}
                  existingFiles={[]}
                  onlyIcon
                  className="!w-[100] !h-[100] min-h-[100] max-h-[100] min-w-[100] max-w-[100] bg-[#EDF0F2] border-solid"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <TextInput name="content.labrl" label="Label" />
            <TextInput name="content.title" label="Heading" />
            <TextareaField name={`content.description`} label="Description" />
            <ProductVariantsForm />
            <DownloadVariantsForm />
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
