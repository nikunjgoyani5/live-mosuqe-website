"use client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaTypeFromPath(
  path: string
): "image" | "video" | "unknown" {
  if (!path) return "unknown";

  // Extract the file extension
  const ext = path.split(".").pop()?.toLowerCase();

  if (!ext) return "unknown";

  const imageExts = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "bmp",
    "tiff",
    "avif",
  ];
  const videoExts = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "3gp"];

  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  return "unknown";
}

export function formatDate(dateString: string) {
  if (!dateString) return "";
  if (typeof window !== "undefined") {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return dateString;
}

export function generateUID(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateObjectWithUID<T extends object>(prefix = "id") {
  return {
    id: `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
}
