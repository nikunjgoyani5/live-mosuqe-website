"use client";
import { useFormContext } from "react-hook-form";
import {
  CONTACT_INPUT_CLASS,
  ContactFieldOption,
} from "@/constants/contact.constants";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options: ContactFieldOption[];
  required?: boolean;
  className?: string;
};

export default function SelectField({
  name,
  label,
  placeholder,
  options,
  required,
  className,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const err = errors[name]?.message as string | undefined;
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`.trim()}>
      {label ? (
        <label htmlFor={name} className="text-dark-100 font-medium">
          {label}
          {required ? <span className="text-red-500 ml-1">*</span> : null}
        </label>
      ) : null}
      <select
        id={name}
        className={CONTACT_INPUT_CLASS}
        aria-invalid={!!err}
        defaultValue=""
        {...register(name)}
      // Do not pass native required to avoid browser tooltip
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
      {err ? <p className="text-red-500 text-xs">{err}</p> : null}
    </div>
  );
}
