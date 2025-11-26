"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  loading?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function SwitchToggle({
  name,
  label,
  loading = false,
  onChange = () => {},
}: Props) {
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextChecked = e.target.checked;
    setValue(name, nextChecked);
    onChange(nextChecked);
  };

  return (
    <div className="flex gap-4 items-center">
      {label && <label className="text-sm font-medium mb-1">{label}</label>}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={watch(name)}
          disabled={loading}
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
            <div className="w-4 h-4 border-2 !border-primary-color !border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </label>
      {errors[name] && (
        <p className="text-xs text-red-500">{String(errors[name]?.message)}</p>
      )}
    </div>
  );
}
