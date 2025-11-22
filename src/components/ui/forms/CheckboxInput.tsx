"use client";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  /** make checkbox required */
  required?: boolean;
};

export default function CheckboxInput({ name, label, required }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          suppressHydrationWarning={true}
          {...register(name, {
            required: required ? `${label ?? "This field"} is required` : false,
          })}
          className="h-4 w-4 accent-blue-600 border-gray-300 rounded"
        />
        {label && <span className="text-sm font-medium">{label}</span>}
      </label>
      {errors[name] && (
        <p className="text-xs text-red-500">{String(errors[name]?.message)}</p>
      )}
    </div>
  );
}
