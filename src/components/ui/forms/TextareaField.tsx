"use client";
import { useFormContext } from "react-hook-form";
import { CONTACT_INPUT_CLASS } from "@/constants/contact.constants";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
};

export default function TextareaField({
  name,
  label,
  placeholder,
  rows = 4,
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
        </label>
      ) : null}
      <textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        className={CONTACT_INPUT_CLASS}
        aria-invalid={!!err}
        suppressHydrationWarning={true}
        {...register(name)}
        required={required}
      />
      {err ? <p className="text-red-500 text-xs">{err}</p> : null}
    </div>
  );
}
