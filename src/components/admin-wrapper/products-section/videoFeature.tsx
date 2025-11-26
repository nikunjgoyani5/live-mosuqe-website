"use client";

import SwitchToggle from "@/components/ui/forms/SwitchToggle";
import TextInput from "@/components/ui/forms/TextInput";
import { useFormContext } from "react-hook-form";

export default function VideoFeatureProduct() {
  const {
    watch,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <SwitchToggle name="content.isVideoEnabled" label="Video Enabled" />
      {watch("content.isVideoEnabled") && (
        <>
          <TextInput name="content.btnText" label="Video Text" />
          <TextInput name="content.path" label="Path" />
        </>
      )}
    </>
  );
}
