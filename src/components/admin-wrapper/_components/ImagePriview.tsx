"use client";
import { isVideo } from "@/components/ui/DropZone";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function ImagePreview({
  url,
  file,
  onDelete,
  className = "w-full h-[300] sm:h-[400] lg:h-[500] object-cover rounded",
}: {
  url?: string;
  file?: File;
  onDelete?: () => void;
  className?: string;
}) {
  if (!file && !url) return null;
  return (
    <div className="relative">
      {file ? (
        !isVideo(file) ? (
          <Image
            src={URL.createObjectURL(file)}
            alt="Preview"
            className={className}
            unoptimized
            width={500}
            height={500}
          />
        ) : (
          <video
            src={URL.createObjectURL(file)}
            autoPlay
            muted
            loop
            controls={false}
            className={className}
          />
        )
      ) : url ? (
        !isVideo(url) ? (
          <Image
            src={url}
            alt="Preview"
            className={className}
            unoptimized
            width={500}
            height={500}
          />
        ) : (
          <video
            src={url}
            autoPlay
            muted
            loop
            controls={false}
            className={className}
          />
        )
      ) : null}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete();
          }}
          className="absolute bottom-2 right-2 bg-white rounded p-2 shadow hover:bg-gray-100"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      )}
    </div>
  );
}
