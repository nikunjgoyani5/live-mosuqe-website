"use client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BASE_URL } from "./axios";

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

/**
 * Converts a relative API path to a full URL using the base API URL
 * @param url - The image/asset URL that might need the base URL prefix
 * @returns The full URL with base URL prefix if needed
 */
export function getFullImageUrl(url: any): string {
  if (!url) return url;

  if (typeof url !== "string") return "";
  // If it's already a full URL (starts with http/https), return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it starts with /uploads/, prepend the base API URL
  if (url.startsWith("/uploads/")) {
    const baseUrl = BASE_URL;
    return `${baseUrl}${url}`;
  }

  // For other relative paths, return as is (like public folder assets)
  return url;
}

/**
 * Maps an array of objects with image URLs to use full URLs
 * @param items - Array of objects containing image URLs
 * @param urlKey - The key name that contains the URL (default: 'url')
 * @returns Array with updated image URLs
 */
export function mapImageUrls<T extends Record<string, any>>(
  items: T[],
  urlKey: keyof T = "url"
): T[] {
  return items.map((item) => ({
    ...item,
    [urlKey]: getFullImageUrl(item[urlKey] as string),
  }));
}
