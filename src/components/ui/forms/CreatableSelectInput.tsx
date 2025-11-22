"use client";

import { useFormContext, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  isMulti?: boolean;
  options?: Option[];
};

export default function CreatableSelectInput({
  name,
  label,
  placeholder,
  required = false,
  isMulti = false,
  options = [],
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label || name} is required` : false,
        }}
        render={({ field }) => (
          <CreatableSelect
            {...field}
            isMulti={isMulti}
            options={options}
            placeholder={placeholder}
            onChange={(selected) => {
              //@ts-ignore
              field.onChange(selected?.value);
            }}
            value={
              options.find((option) => option.value === field.value) ||
              field.value
                ? {
                    label: field.value,
                    value: field.value,
                  }
                : null
            }
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: "0.5rem",
                borderColor: state.isFocused ? "#3B82F6" : "#d1d5db",
                boxShadow: state.isFocused
                  ? "0 0 0 2px rgba(59,130,246,0.3)"
                  : "none",
                minHeight: "40px",
                "&:hover": {
                  borderColor: "#3B82F6",
                },
              }),
              menu: (base) => ({
                ...base,
                zIndex: 20,
              }),
            }}
          />
        )}
      />

      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
