"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import Image from "next/image";

const PLATFORMS = ["Google Play", "App Store"];

const imagesMap = {
  "Google Play": "/googleplay.png",
  "App Store": "/appstore.png",
};

export default function DownloadVariantsForm() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "content.downloadPlatforms",
  });

  const existingPlatforms = fields.map((field: any) => field.name);

  const addPlatform = (platformName: string) => {
    if (existingPlatforms.includes(platformName)) return;
    if (fields.length >= 3) return alert("Max 3 platforms allowed!");
    append({
      name: platformName,
      link: "",
      //@ts-ignore
      image: imagesMap[platformName] || "",
    });
  };

  const removePlatform = (index: number) => {
    remove(index);
  };

  return (
    <>
      {/* Select Platform */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Add Platform Variant</label>
        <div className="flex gap-2 flex-wrap">
          {PLATFORMS.map((platform) => (
            <button
              type="button"
              key={platform}
              onClick={() => addPlatform(platform)}
              disabled={existingPlatforms.includes(platform)}
              className={`px-3 py-1 rounded-md text-sm border ${
                existingPlatforms.includes(platform)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Variant Rows */}
      {fields.map((field: any, index) => (
        <div
          key={field.id}
          className="relative p-4 pt-0 border-b border-b-black/10 last:border-b-0 flex items-center w-full justify-between gap-5"
        >
          <div className="flex-1 flex items-center gap-4">
            <Image
              //@ts-ignore
              src={imagesMap[field.name] || "/amazon.png"}
              alt={"product image"}
              className="h-8 sm:h-8 w-28 object-contain"
              width={128}
              height={128}
              quality={100}
              priority
            />
            <div className="flex-1">
              <input
                type="url"
                placeholder={`Enter ${field.name} product link`}
                {...register(`content.downloadPlatforms.${index}.link`)}
                className="w-full border rounded-md p-2 text-sm"
              />
              <input
                type="hidden"
                {...register(`content.downloadPlatforms.${index}.name`)}
                defaultValue={field.name}
              />
            </div>
          </div>
          {/* Remove */}
          <button
            type="button"
            onClick={() => removePlatform(index)}
            className=" text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </>
  );
}
