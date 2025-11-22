"use client";
import { useFormContext, Controller } from "react-hook-form";
import PhoneInput from 'react-phone-number-input';
import { CONTACT_INPUT_CLASS } from "@/constants/contact.constants";
import { Globe } from 'lucide-react';
import 'react-phone-number-input/style.css';

type Props = {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
};

export default function PhoneField({
    name,
    label,
    placeholder,
    required,
    className,
}: Props) {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const err = errors[name]?.message as string | undefined;

    return (
        <div className={`flex flex-col gap-2 ${className ?? ""}`.trim()}>
            {label ? (
                <label htmlFor={name} className="text-dark-100 line-clamp-1 max-w-[35ch] font-medium">
                    {label}
                    {required ? <span className="text-red-500 ml-1">*</span> : null}
                </label>
            ) : null}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="relative">
                        {/* Visible custom icon */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Globe className="h-5 w-5 text-gray-500" />
                        </div>
                        {/* Phone input (country select overlaid invisibly so clicking icon opens native select) */}
                        <PhoneInput
                            {...field}
                            id={name}
                            placeholder={placeholder}
                            className={`phone-input-wrapper ${CONTACT_INPUT_CLASS}`}
                            inputClassName={CONTACT_INPUT_CLASS}
                            aria-invalid={!!err}
                            international
                            defaultCountry="US"
                        />
                    </div>
                )}
            />
            {err ? <p className="text-red-500 text-xs">{err}</p> : null}
            <style jsx>{`
                :global(.phone-input-wrapper) {
                    display: flex !important;
                    align-items: center !important;
                    position: relative !important;
                }
                /* Overlay the native country select where the globe icon sits so clicks trigger dropdown */
                :global(.phone-input-wrapper .PhoneInputCountrySelect) {
                    position: absolute !important;
                    left: 6px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    width: 24px !important;
                    height: 24px !important;
                    opacity: 0 !important; /* Invisible but clickable */
                    cursor: pointer !important;
                    background: transparent !important;
                    border: none !important;
                    appearance: none !important;
                }
                // :global(.phone-input-wrapper .PhoneInputCountryIcon) {
                //     display: none !important; /* Hide default flag/icon */
                // }
                :global(.phone-input-wrapper .PhoneInputInput) {
                    flex: 1 !important;
                    border: none !important;
                    outline: none !important;
                    background: transparent !important;
                    font-size: inherit !important;
                    color: inherit !important;
                    padding-left: 10px !important; /* Space for globe */
                }
                :global(.phone-input-wrapper .PhoneInputInput::placeholder) {
                    color: rgb(148 163 184) !important;
                }
            `}</style>
        </div>
    );
}