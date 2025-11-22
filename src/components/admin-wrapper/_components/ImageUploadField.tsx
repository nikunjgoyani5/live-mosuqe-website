"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import Dropzone from "@/components/ui/DropZone";
import { BASE_URL } from "@/lib/axios";

interface IImageUploadFieldProps {
  name: string;
  uploadMedia: Record<string, File>;
  existingImagePath?: string | null;
  addUploadMedia: (name: string, file: File) => void;
  markDeletedMedia: (name: string, pathToDelete: string) => void;
  className?: string;
  aspectRatio?: string;
  onlyIcon?: boolean;
  existingFiles?: { key: string; path: string }[];
  files: { [key: string]: File };
  onDeleteFile: (key: string, path?: string) => void;
}

export default function ImageUploadField({
  name,
  uploadMedia,
  existingImagePath,
  addUploadMedia,
  markDeletedMedia,
  className = "w-full h-auto object-cover rounded",
  aspectRatio = "aspect-square",
  existingFiles = [],
  files = {},
  onDeleteFile = () => {},
  ...props
}: IImageUploadFieldProps) {
  const newImageFile = uploadMedia[name];

  // 1. A new file has been selected for upload
  if (newImageFile) {
    return (
      <div className={`relative ${aspectRatio}`}>
        <Image
          src={URL.createObjectURL(newImageFile)}
          alt="Preview"
          className={className}
          unoptimized
          fill
        />
        <button
          type="button"
          onClick={() => markDeletedMedia(name, "")}
          className="absolute bottom-2 right-2 bg-white rounded p-2 shadow hover:bg-gray-100"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    );
  }

  // 2. An existing image is already saved
  if (existingImagePath) {
    return (
      <div className={`relative ${aspectRatio}`}>
        <Image
          src={`${BASE_URL}${existingImagePath}`}
          alt="Uploaded"
          className={className}
          fill
        />
        <button
          type="button"
          onClick={() => markDeletedMedia(name, existingImagePath)}
          className="absolute bottom-2 right-2 bg-white rounded p-2 shadow hover:bg-gray-100"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    );
  }

  // 3. No image is present, show the dropzone
  return (
    <div className={aspectRatio}>
      <Dropzone
        existingFiles={existingFiles}
        files={files}
        name={name}
        onAddFile={addUploadMedia}
        onDeleteFile={onDeleteFile}
        className={aspectRatio}
        {...props}
      />
    </div>
  );
}
