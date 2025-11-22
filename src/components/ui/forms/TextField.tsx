"use client";
import { useFormContext } from "react-hook-form";
import { CONTACT_INPUT_CLASS } from "@/constants/contact.constants";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export default function TextField({
  name,
  label,
  placeholder,
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
        <label htmlFor={name} className="text-dark-100 line-clamp-1 font-medium">
          {label}
          {required ? <span className="text-red-500 ml-1">*</span> : null}
        </label>
      ) : null}
      <input
        id={name}
        type="text"
        placeholder={placeholder}
        className={CONTACT_INPUT_CLASS}
        aria-invalid={!!err}
        suppressHydrationWarning={true}
        {...register(name)}
      // Do not pass native required to avoid browser tooltip
      />
      {err ? <p className="text-red-500 text-xs">{err}</p> : null}
    </div>
  );
}
