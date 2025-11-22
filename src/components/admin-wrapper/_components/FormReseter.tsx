import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const FormResetter = ({ data }: { data: any }) => {
  const { reset } = useFormContext();

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  return null; // This component doesn't render anything
};
