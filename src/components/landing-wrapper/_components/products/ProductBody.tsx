"use client";

import React from "react";
import { ReadMoreDialog } from "./ReadMoreDialog";
import { PlatformGrid } from "./PlatformGrid";
import { DownloadAndShare } from "./DownloadAndShare";
import type { ProductSectionProps } from "./types";
import { Button } from "@/components/ui/Button";
import { MdOndemandVideo } from "react-icons/md";

type Props = Pick<
  ProductSectionProps,
  | "typeLabel"
  | "title"
  | "description"
  | "platforms"
  | "downloadPlatforms"
  | "platformTitle"
  | "readMoreLabel"
  | "slug"
  | "modelImage"
  | "videoBtnText"
  | "videoPath"
  | "downloadText"
  | "isVideoEnabled"
>;

const ProductBodyComponent: React.FC<Props> = ({
  typeLabel = "",
  title,
  description,
  platforms = [],
  downloadPlatforms = [],
  platformTitle = "",
  readMoreLabel = "Read More",
  slug,
  modelImage,
  videoBtnText,
  videoPath,
  downloadText,
  isVideoEnabled,
}) => {
  return (
    <div className="w-full h-full">
      <div
        className="flex flex-col space-y-3 bg-center bg-no-repeat h-full w-full justify-center px-4 py-6 sm:py-6"
        style={{ backgroundImage: "url(/productDescriptionBG.png)" }}
      >
        {typeLabel && (
          <p className="font-montserrat tracking-wide text-sm sm:text-base lg:text-lg font-medium text-dark-100 line-clamp-1 max-w-[30ch] lg:max-w-[45ch]">
            {typeLabel}
          </p>
        )}
        <h2 className="section-name-heading-responsive font-cinzel-decorative font-semibold leading-tight text-primary-color line-clamp-2 max-w-md">
          {title}
        </h2>
        <p className="body-description text-dark-100 md:line-clamp-4 lg:line-clamp-7 text-justify">
          {description}
        </p>
        {((Array.isArray(modelImage) && modelImage.length > 0) ||
          (videoPath && isVideoEnabled)) && (
          <div className="flex items-center gap-5">
            {Array.isArray(modelImage) && modelImage.length > 0 && (
              <ReadMoreDialog
                title={title}
                trigger={
                  <button className="rounded-lg cursor-pointer bg-primary-color px-5 py-2 sm:px-6 sm:py-3 text-sm font-medium text-white hover:bg-primary-color/90 flex items-center gap-2 w-fit">
                    {readMoreLabel}
                  </button>
                }
                modelImages={modelImage}
              />
            )}
            {videoPath && isVideoEnabled && (
              <a
                href={videoPath || "#"}
                target="_blank"
                className="rounded-lg cursor-pointer bg-primary-color px-5 py-2 sm:px-6 sm:py-3 text-sm font-medium text-white hover:bg-primary-color/90 flex items-center gap-2 w-fit "
              >
                <MdOndemandVideo fontSize={20} />
                {videoBtnText || "Video"}
              </a>
            )}
          </div>
        )}
        <PlatformGrid platforms={platforms} platformTitle={platformTitle} />
        <DownloadAndShare
          downloadPlatforms={downloadPlatforms}
          slug={slug}
          downloadText={downloadText}
        />
      </div>
    </div>
  );
};

export const ProductBody = React.memo(ProductBodyComponent);
