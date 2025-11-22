"use client";

import { useFormContext } from "react-hook-form";

type Option = {
  value: string | number;
  label: string;
};

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[]; // array of { value, label }
  required?: boolean;
};

export default function SelectInput({
  name,
  label,
  placeholder,
  options,
  required = true,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <select
        {...register(name, {
          required: required ? `${label ?? name} is required` : false,
        })}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        defaultValue=""
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-xs text-red-500">{String(errors[name]?.message)}</p>
      )}
    </div>
  );
}
