"use client";
import { useMemo, useState } from "react";
import {
  CONTACT_DUMMY_CONFIG,
  ContactField,
} from "@/constants/contact.constants";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  ContactCallIcon,
  ContactLocationIcon,
  ContactMailIcon,
} from "@/constants/icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import TextField from "@/components/ui/forms/TextField";
import NumberField from "@/components/ui/forms/NumberField";
import TextareaField from "@/components/ui/forms/TextareaField";
import SelectField from "@/components/ui/forms/SelectField";
import PhoneField from "@/components/ui/forms/PhoneField";
import Image from "next/image";
import { ISection, IContactContent } from "@/constants/section.constants";
import { sendContactMessage, SendMessagePayload } from "@/services/contact";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

interface IProps {
  data?: ISection;
}

export default function ContactSection({ data }: IProps) {
  if (!data?.visible) return null;
  // Util: convert camelCase/snake_case to "Title Case" with spaces
  const humanize = (s: string | undefined): string => {
    if (!s) return "";
    return s
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
  };
  // Type guard and data extraction
  const contactContent =
    data?.content && "title" in data.content && "form" in data.content
      ? (data.content as unknown as IContactContent)
      : null;

  // Build dynamic config from server data or use default
  const config = contactContent
    ? {
        left: {
          logoSrc: "/Searviceheader.png",
          heading: contactContent.title || "LET'S CONNECT CONSTELLATIONS",
          description:
            contactContent.description ||
            "Questions, comments or feedback, please feel free to reach us.",
          submitText: "Submit",
        },
        right: {
          officeHoursLabel:
            contactContent.office_title || "Our office hours are",
          dayRange: "Monday to Friday", // Parse from office_hours if needed
          timeRange:
            contactContent.office_hours ||
            contactContent["office_hours "] ||
            "12 PM to 9 PM EST",
          phone: contactContent.call || "+1-347-302-8394",
          email: contactContent.email || "info@livemosque.live",
          address: contactContent.location || "New York, USA",
        },
        form: {
          fields: [] as ContactField[], // Will be built dynamically
        },
      }
    : CONTACT_DUMMY_CONFIG;

  // Build dynamic form fields based on server data
  if (contactContent?.form) {
    const dynamicFields: ContactField[] = [];

    if (contactContent.form.first_name) {
      dynamicFields.push({
        id: "firstName",
        name: "firstName",
        type: "text",
        label: humanize(contactContent.form.first_name),
        placeholder: contactContent.form.first_name,
        required: true,
      });
    }

    if (contactContent.form.last_name) {
      dynamicFields.push({
        id: "lastName",
        name: "lastName",
        type: "text",
        label: humanize(contactContent.form.last_name),
        placeholder: contactContent.form.last_name,
        required: true,
      });
    }

    if (contactContent.form.email) {
      dynamicFields.push({
        id: "email",
        name: "email",
        type: "text",
        label: humanize(contactContent.form.email),
        placeholder: contactContent.form.email,
        required: true,
      });
    }

    if (contactContent.form.phone) {
      dynamicFields.push({
        id: "phone",
        name: "phone",
        type: "phone",
        label: humanize(contactContent.form.phone),
        placeholder: contactContent.form.phone,
        required: true,
      });
    }

    if (contactContent.form.message) {
      dynamicFields.push({
        id: "message",
        name: "message",
        type: "textarea",
        label: humanize(contactContent.form.message),
        placeholder: contactContent.form.message,
        rows: 4,
        required: true,
      });
    }

    config.form.fields = dynamicFields;
  }

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const f of config.form.fields) {
      const label =
        f.label && f.label.trim().length > 0 ? f.label : humanize(f.name);
      let fieldSchema: z.ZodTypeAny;
      switch (f.type) {
        case "phone": {
          // Phone validation using react-phone-number-input
          if (f.required) {
            fieldSchema = z
              .union([z.string(), z.undefined()])
              .transform((val) => val || "")
              .refine((val) => val.length > 0, {
                message: "Mobile phone is required",
              })
              .refine((val) => isValidPhoneNumber(val), {
                message: "Please enter a valid mobile phone number",
              });
          } else {
            fieldSchema = z
              .union([z.string(), z.undefined()])
              .transform((val) => val || "")
              .refine((val) => val === "" || isValidPhoneNumber(val), {
                message: "Please enter a valid mobile phone number",
              })
              .optional();
          }
          break;
        }
        case "number": {
          // Numbers: allow empty when not required; otherwise ensure valid number
          if (f.required) {
            fieldSchema = z.preprocess(
              (val) =>
                val === "" || val === null || val === undefined
                  ? undefined
                  : val,
              z
                .union([z.string(), z.number()])
                .transform((val: string | number) =>
                  typeof val === "string" ? Number(val) : val
                )
                .refine((n: number) => !Number.isNaN(n), {
                  message: `${label} must be a number`,
                })
            );
          } else {
            fieldSchema = z
              .union([z.string(), z.number()])
              .refine(
                (val) => val === "" || !Number.isNaN(Number(val as any)),
                { message: `${label} must be a number` }
              )
              .optional();
          }
          break;
        }
        case "textarea":
        case "text": {
          // Email special-case formatting
          if (f.name.toLowerCase() === "email") {
            if (f.required) {
              fieldSchema = z
                .string()
                .min(1, `${label} is required`)
                .email("Enter a valid email address");
            } else {
              fieldSchema = z
                .string()
                .email("Enter a valid email address")
                .or(z.literal(""));
            }
          } else {
            const s = z.string();
            fieldSchema = f.required ? s.min(1, `${label} is required`) : s;
          }
          break;
        }
        case "select": {
          const s = z.string();
          fieldSchema = f.required ? s.min(1, `${label} is required`) : s;
          break;
        }
        default:
          fieldSchema = z.any();
      }
      shape[f.name] = fieldSchema;
    }
    return z.object(shape);
  }, [config.form.fields]);

  const defaultValues = useMemo(() => {
    return Object.fromEntries(
      config.form.fields.map((f) => [f.name, f.defaultValue ?? ""]) as [
        string,
        unknown
      ][]
    );
  }, [config.form.fields]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { handleSubmit } = methods;
  const [submitting, setSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      // Map dynamic field names to API expected keys
      const email = String(values["email"] ?? "");
      const f_name = String(values["firstName"] ?? values["f_name"] ?? "");
      const l_name = String(values["lastName"] ?? values["l_name"] ?? "");
      const message = String(values["message"] ?? "");
      const phone_number = String(
        values["phone"] ?? values["phone_number"] ?? ""
      );

      const payload: SendMessagePayload = {
        email,
        f_name,
        l_name,
        message,
        otp: null,
        phone_number,
      };

      // Fire API call
      await sendContactMessage(payload);
      toast.success("Message sent successfully.");
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const left = config?.left;
  const right = config?.right;

  return (
    <section
      id="contact-us"
      className="scroll-section lg:py-24 flex items-center justify-center bg-[#e8d3b0] p-4 sm:p-6"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-7 bg-white rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-lg overflow-hidden">
        {/* Left Section - Form */}
        <div className="p-4 sm:p-6 lg:p-8 lg:col-span-5">
          {/* Logo */}
          {left?.logoSrc ? (
            <div className="mb-3 sm:mb-4">
              <Image
                src={left.logoSrc}
                alt="Mosque Icon"
                className="w-8 h-10 sm:w-10 sm:h-12"
                width={40}
                height={40}
              />
            </div>
          ) : null}

          {/* Heading */}
          <h2 className="heading-responsive font-cinzel font-bold text-primary-color mb-2 line-clamp-1">
            {left?.heading ?? ""}
          </h2>

          {/* Description */}
          <p
            title={left?.description ?? ""}
            className="text-dark-100 line-clamp-1 font-medium text-sm sm:text-base mb-4 sm:mb-6"
          >
            {left?.description ?? ""}
          </p>

          {/* Form */}
          <FormProvider {...methods}>
            <form
              className="space-y-3 sm:space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                {config.form.fields.map((field) => (
                  <div
                    key={field.id}
                    className={field.type === "textarea" ? "sm:col-span-2" : ""}
                  >
                    <FieldRenderer field={field} />
                  </div>
                ))}
              </div>
              {/* Add reCAPTCHA */}
              <div className="mt-4">
                {/* https://developers.google.com/recaptcha/intro generate site key from here */}
                <ReCAPTCHA
                  sitekey={
                    process.env?.NEXT_PUBLIC_SITE_KEY ||
                    "6LdbMR8sAAAAAJat-0lazApFuURRgK5mChNDiGBZ"
                  } // Replace with your site key
                  onChange={(value) => setCaptchaVerified(!!value)}
                  onExpired={() => setCaptchaVerified(false)}
                />
              </div>
              <PrimaryButton
                type="submit"
                disabled={submitting || !captchaVerified} // Disable if captcha not verified
                className="disabled:opacity-60"
              >
                {submitting ? "Sending..." : left?.submitText ?? "Submit"}
              </PrimaryButton>
            </form>
          </FormProvider>
        </div>

        {/* Right Section - Info */}
        <div className="bg-primary-color text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-center rounded-b-2xl sm:rounded-b-3xl lg:rounded-tl-[2rem] lg:rounded-4xl lg:col-span-2">
          <div className="text-xs sm:text-lg text-center w-full line-clamp-1">
            {right?.officeHoursLabel ?? ""}
          </div>
          <div className="text-secondary-color drop-shadow bg-white/10 rounded-xl lg:rounded-2xl py-2 sm:py-3 px-3 sm:px-4 my-2 sm:my-3 text-center text-lg sm:text-xl font-semibold">
            <p className="font-semibold">{right?.dayRange ?? ""}</p>
            <p className="font-semibold line-clamp-2">
              {right?.timeRange ?? ""}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="bg-white p-1 sm:p-1.5 rounded-lg">
                <ContactCallIcon />
              </span>
              <span className="text-sm sm:text-base break-all line-clamp-1">
                {right?.phone ?? ""}
              </span>
            </div>
            <div className="border border-dashed !border-white/50" />
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="bg-white p-1 sm:p-1.5 rounded-lg">
                <ContactMailIcon />
              </span>
              <span className="text-sm sm:text-base break-all line-clamp-1">
                {right?.email ?? ""}
              </span>
            </div>
            <div className="border border-dashed !border-white/50" />
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="bg-white p-1 sm:p-1.5 rounded-lg">
                <ContactLocationIcon />
              </span>
              <span className="text-sm sm:text-base line-clamp-2">
                {right?.address ?? ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldRenderer({ field }: { field: ContactField }) {
  const common = {
    name: field.name,
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
  };
  switch (field.type) {
    case "text":
      return <TextField {...common} />;
    case "phone":
      return <PhoneField {...common} />;
    case "number":
      return <NumberField {...common} />;
    case "textarea":
      return <TextareaField {...common} rows={field?.rows ?? 4} />;
    case "select":
      return <SelectField {...common} options={field?.options ?? []} />;
    default:
      return null;
  }
}
