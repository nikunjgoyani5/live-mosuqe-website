"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import Dropzone from "@/components/ui/DropZone";
import { BASE_URL } from "@/lib/axios";
import Cropper from "react-easy-crop";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import StateButton from "@/components/ui/StateButton";

interface IImageUploadFieldProps {
  variant?: "image" | "video" | "both";
  name: string;
  uploadMedia: Record<string, File>;
  existingImagePath?: string | null;
  addUploadMedia: (name: string, file: File) => void;
  markDeletedMedia: (name: string, pathToDelete: string) => void;
  className?: string;
  aspectRatio?: string;
  onlyIcon?: boolean;
  skipTool?: boolean;
  existingFiles?: { key: string; path: string }[];
  files: { [key: string]: File };
  onDeleteFile: (key: string, path?: string) => void;

  // new optional props
  targetWidth?: number; // default 500
  targetHeight?: number; // default 500
  onChange?: (name: string, file: File) => void;
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
  targetWidth = 500,
  targetHeight = 500,
  onChange,
  ...props
}: IImageUploadFieldProps) {
  const newImageFile = uploadMedia[name];

  // Cropper state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropName, setCropName] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);

  const inputRef = useRef<HTMLImageElement | null>(null);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // helper: create HTMLImageElement from dataURL
  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (err) => reject(err));
      img.crossOrigin = "anonymous";
      img.src = url;
    });

  // helper: get cropped image as Blob (supports rotation)
  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotationDeg: number,
    outputWidth: number,
    outputHeight: number
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);

    // If no rotation, draw directly
    if (!rotationDeg) {
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // Ensure transparent areas are flattened to white (preserve existing non-transparent pixels)
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // react-easy-crop returns pixelCrop in natural image pixels
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      return await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) throw new Error("Canvas is empty");
            resolve(blob);
          },
          "image/jpeg",
          0.92
        );
      });
    }

    // For rotated image: draw image centered on a large temporary canvas, rotate, then crop from it
    const rotRad = (rotationDeg * Math.PI) / 180;

    const { naturalWidth: iw, naturalHeight: ih } = image;
    const maxSide = Math.max(iw, ih);
    const safeArea = Math.ceil(Math.sqrt(iw * iw + ih * ih));

    // temporary canvas to hold rotated image
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = safeArea;
    tmpCanvas.height = safeArea;
    const tmpCtx = tmpCanvas.getContext("2d");
    if (!tmpCtx) throw new Error("Could not get canvas context");

    // Fill background white so transparent areas become white after conversion
    tmpCtx.fillStyle = "white";
    tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

    // move to center and rotate
    tmpCtx.translate(safeArea / 2, safeArea / 2);
    tmpCtx.rotate(rotRad);
    // draw image centered
    tmpCtx.drawImage(image, -iw / 2, -ih / 2);

    // compute crop origin on rotated canvas
    // react-easy-crop's pixelCrop is relative to the original unrotated image's top-left.
    // The original image was drawn centered at (safeArea/2, safeArea/2) with its top-left at:
    const originX = safeArea / 2 - iw / 2;
    const originY = safeArea / 2 - ih / 2;

    const sx = originX + pixelCrop.x;
    const sy = originY + pixelCrop.y;
    const sw = pixelCrop.width;
    const sh = pixelCrop.height;

    // output canvas
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = outputWidth;
    outputCanvas.height = outputHeight;
    const outCtx = outputCanvas.getContext("2d");
    if (!outCtx) throw new Error("Could not get canvas context");

    // Ensure final canvas has white background for any transparent areas
    outCtx.fillStyle = "white";
    outCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

    outCtx.drawImage(
      tmpCanvas,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      outputWidth,
      outputHeight
    );

    return await new Promise<Blob>((resolve) => {
      outputCanvas.toBlob(
        (blob) => {
          if (!blob) throw new Error("Canvas is empty");
          resolve(blob);
        },
        "image/jpeg",
        0.92
      );
    });
  };

  // When Dropzone adds a file, intercept to open the cropper
  const handleAddFile = (fieldName: string, file: File) => {
    // If SVG, skip cropper and add directly
    if (file.type === "image/svg+xml") {
      alert("SVG files are not supported");
      return;
    }

    // If skipTool is true, upload directly without cropping
    if (props.skipTool) {
      addUploadMedia(fieldName, file);
      if (onChange) onChange(fieldName, file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCropName(fieldName);
      setOriginalFile(file);
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setCropSrc(null);
    setOriginalFile(null);
    setCropName(null);
    setRotation(0);
  };

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels || !cropName || !originalFile) return;

    const blob = await getCroppedImg(
      cropSrc,
      croppedAreaPixels,
      rotation,
      targetWidth,
      targetHeight
    );

    const croppedFile = new File([blob], originalFile.name, {
      type: blob.type,
    });

    // send to your existing uploader
    addUploadMedia(cropName, croppedFile);

    // optional onChange callback
    if (onChange) onChange(cropName, croppedFile);

    // cleanup
    setShowCropper(false);
    setCropSrc(null);
    setOriginalFile(null);
    setCropName(null);
    setRotation(0);
  };

  // Cropper modal component to avoid duplication
  const CropperModal = (
    <>
      <div className="relative h-80 w-full bg-gray-200">
        <Cropper
          image={cropSrc!}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={targetWidth / targetHeight}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="flex items-center gap-4 p-4">
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rotate</span>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
          />
          <span className="w-10 text-right text-sm text-gray-600">
            {Math.round(rotation)}°
          </span>
        </label>
        <div className="ml-auto flex gap-2">
          <StateButton
            variant="outline"
            type="button"
            onClick={handleCropCancel}
          >
            Cancel
          </StateButton>
          <StateButton
            className="text-nowrap"
            type="button"
            onClick={handleCropConfirm}
          >
            Crop & Use Image
          </StateButton>
        </div>
      </div>
    </>
  );

  // 1. A new file has been selected for upload
  if (newImageFile) {
    return (
      <>
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

        {/* Cropper Modal (in case user re-uploads while previewing) */}
        {showCropper && cropSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-3xl bg-white rounded">
              {CropperModal}
            </div>
          </div>
        )}
      </>
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
        onAddFile={handleAddFile}
        onDeleteFile={onDeleteFile}
        className={aspectRatio}
        {...props}
      />
      {/* Cropper Modal */}
      {showCropper && cropSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-3xl bg-white rounded">
            {CropperModal}
          </div>
        </div>
      )}
    </div>
  );
}
