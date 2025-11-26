import React from "react";

function ImageGuidelines({
  resolution,
  className = "",
}: {
  resolution: string;
  className?: string;
}) {
  return (
    <p className={`text-sm text-gray-400 ${className}`}>
      {resolution} px recommended
    </p>
  );
}

export default ImageGuidelines;
