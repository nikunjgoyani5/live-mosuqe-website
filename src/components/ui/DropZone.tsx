"use client";
import { getFullImageUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useRef } from "react";
import { GoPlus } from "react-icons/go";
import { MdDelete } from "react-icons/md";

interface DropzoneProps {
  name: string;
  className?: string;
  onlyIcon?: boolean;
  files: { [key: string]: File };
  onAddFile: (key: string, file: File) => void;
  onDeleteFile: (key: string, path?: string) => void; // path optional if existing file
  existingFiles?: { key: string; path: string }[]; // already uploaded
  variant?: "image" | "video" | "both";
}

export const isVideo = (file: File | string) => {
  if (typeof file === "string") {
    // existing file path case
    return /\.(mp4|mov|avi|mkv|webm)$/i.test(file);
  }
  // new uploaded File case
  return file && file?.type?.startsWith("video/");
};

export default function Dropzone({
  files,
  onAddFile,
  onDeleteFile,
  existingFiles = [],
  name = "",
  className = "",
  variant = "both",
  onlyIcon = false,
}: DropzoneProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    // you can generate a key (uuid or name)
    // const key = `${Date.now()}-${file.name}`;
    onAddFile(name, file);
  };

  const acceptTypes =
    variant === "video"
      ? ".mp4,.mov,.avi,.mkv,.webm"
      : variant === "both"
      ? ".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.mkv,.webm"
      : ".jpg,.jpeg,.png,.gif,.webp";

  return (
    <div className="flex items-center gap-4 w-full">
      <div
        className={`flex text-center flex-col items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer w-full min-h-52 ${className}`}
        onClick={() => fileInput.current?.click()}
      >
        <GoPlus size={32} />
        {!onlyIcon && (
          <p className="text-sm">Drop your image here, or browse</p>
        )}
        {!onlyIcon && (
          <p className="text-xs text-gray-400">
            Supports {variant === "both" ? "images & videos" : variant}
          </p>
        )}
        <input
          type="file"
          ref={fileInput}
          className="hidden"
          accept={acceptTypes}
          onChange={handleFileChange}
        />
      </div>

      {/* Previews of existing files */}
      {existingFiles.map((f) => (
        <div key={f.key} className="relative">
          <Image
            src={getFullImageUrl(f.path)}
            alt=""
            className="w-16 h-16 rounded"
            width={64}
            height={64}
          />
          <MdDelete
            className="absolute top-0 right-0 cursor-pointer bg-white rounded-full"
            onClick={() => onDeleteFile(f.key, f.path)}
          />
        </div>
      ))}

      {/* Previews of new uploads */}
      {Object.entries(files).map(([key, file]) => (
        <div key={key} className="relative">
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-16 h-16 rounded"
            width={64}
            height={64}
          />
          <MdDelete
            className="absolute top-0 right-0 cursor-pointer bg-white rounded-full"
            onClick={() => onDeleteFile(key)}
          />
        </div>
      ))}
    </div>
  );
}
