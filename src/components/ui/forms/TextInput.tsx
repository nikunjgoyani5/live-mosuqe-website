"use client";

import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
};

export default function TextInput({
  name,
  label,
  type = "text",
  placeholder,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        suppressHydrationWarning={true}
        {...register(name, { required: `${label} is required` })}
        type={type}
        placeholder={placeholder}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors[name] && (
        <p className="text-xs text-red-500">{String(errors[name]?.message)}</p>
      )}
    </div>
  );
}
