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

export default function NumberField({
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
        <label htmlFor={name} className="text-dark-100 font-medium">
          {label}
        </label>
      ) : null}
      <input
        id={name}
        type="number"
        placeholder={placeholder}
        className={CONTACT_INPUT_CLASS}
        aria-invalid={!!err}
        suppressHydrationWarning={true}
        {...register(name, { valueAsNumber: true })}
        required={required}
      />
      {err ? <p className="text-red-500 text-xs">{err}</p> : null}
    </div>
  );
}
