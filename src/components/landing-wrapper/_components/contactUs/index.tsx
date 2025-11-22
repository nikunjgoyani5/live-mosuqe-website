"use client";
import { useMemo } from "react";
import {
  CONTACT_DUMMY_CONFIG,
  ContactField,
} from "@/constants/contact.constants";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Image from "next/image";
import { ISection, IContactContent } from "@/constants/section.constants";

interface IProps {
  data?: ISection;
}

export default function ContactSection({ data }: IProps) {
  // Type guard and data extraction
  const contactContent = (data?.content && 'title' in data.content && 'form' in data.content)
    ? data.content as unknown as IContactContent
    : null;

  // Build dynamic config from server data or use default
  const config = contactContent ? {
    left: {
      logoSrc: "/Searviceheader.png",
      heading: contactContent.title || "LET'S CONNECT CONSTELLATIONS",
      description: contactContent.description || "Questions, comments or feedback, please feel free to reach us.",
      submitText: "Submit",
    },
    right: {
      officeHoursLabel: contactContent.office_title || "Our office hours are",
      dayRange: "Monday to Friday", // Parse from office_hours if needed
      timeRange: contactContent.office_hours || contactContent["office_hours "] || "12 PM to 9 PM EST",
      phone: contactContent.call || "+1-347-302-8394",
      email: contactContent.email || "info@livemosque.live",
      address: contactContent.location || "New York, USA",
    },
    form: {
      fields: [] as ContactField[], // Will be built dynamically
    }
  } : CONTACT_DUMMY_CONFIG;

  // Build dynamic form fields based on server data
  if (contactContent?.form) {
    const dynamicFields: ContactField[] = [];

    if (contactContent.form.first_name) {
      dynamicFields.push({
        id: "firstName",
        name: "firstName",
        type: "text",
        placeholder: contactContent.form.first_name,
        required: true,
      });
    }

    if (contactContent.form.last_name) {
      dynamicFields.push({
        id: "lastName",
        name: "lastName",
        type: "text",
        placeholder: contactContent.form.last_name,
      });
    }

    if (contactContent.form.email) {
      dynamicFields.push({
        id: "email",
        name: "email",
        type: "text",
        placeholder: contactContent.form.email,
        required: true,
      });
    }

    if (contactContent.form.phone) {
      dynamicFields.push({
        id: "phone",
        name: "phone",
        type: "text",
        placeholder: contactContent.form.phone,
      });
    }

    if (contactContent.form.message) {
      dynamicFields.push({
        id: "message",
        name: "message",
        type: "textarea",
        placeholder: contactContent.form.message,
        rows: 4,
      });
    }

    config.form.fields = dynamicFields;
  }

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const f of config.form.fields) {
      const label = f.label ?? f.name;
      let fieldSchema: z.ZodTypeAny;
      switch (f.type) {
        case "number": {
          const num = z
            .union([z.string(), z.number()])
            .transform((val: string | number) =>
              typeof val === "string" ? Number(val) : val
            )
            .refine((n: number) => !Number.isNaN(n), {
              message: `${label} must be a number`,
            });
          fieldSchema = f.required
            ? num.refine((n: number) => n !== undefined && n !== null, {
              message: `${label} is required`,
            })
            : num;
          break;
        }
        case "textarea":
        case "text": {
          const s = z.string();
          fieldSchema = f.required ? s.min(1, `${label} is required`) : s;
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

  const methods = useForm({ resolver: zodResolver(schema), defaultValues });
  const { handleSubmit } = methods;

  const onSubmit = (values: Record<string, unknown>) => {
    console.log("Contact form submit", values);
    // TODO: integrate with API later
  };

  const left = config?.left;
  const right = config?.right;

  return (
    <section id="contact-us" className="scroll-section lg:py-24 flex items-center justify-center bg-[#e8d3b0] p-4 sm:p-6">
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
          <h2 className="heading-responsive font-cinzel font-bold text-primary-color mb-2">
            {left?.heading ?? ""}
          </h2>

          {/* Description */}
          <p className="text-dark-100 font-medium text-sm sm:text-base mb-4 sm:mb-6">
            {left?.description ?? ""}
          </p>

          {/* Form */}
          <FormProvider {...methods}>
            <form
              className="space-y-3 sm:space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {config.form.fields.map((field) => (
                  <FieldRenderer key={field.id} field={field} />
                ))}
              </div>
              <PrimaryButton>{left?.submitText ?? "Submit"}</PrimaryButton>
            </form>
          </FormProvider>
        </div>

        {/* Right Section - Info */}
        <div className="bg-primary-color text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-center rounded-b-2xl sm:rounded-b-3xl lg:rounded-tl-[2rem] lg:rounded-4xl lg:col-span-2">
          <div className="text-xs sm:text-sm text-center w-full">
            {right?.officeHoursLabel ?? ""}
          </div>
          <div className="text-secondary-color drop-shadow bg-white/10 rounded-xl lg:rounded-2xl py-2 sm:py-3 px-3 sm:px-4 my-2 sm:my-3 text-center text-lg sm:text-xl font-semibold">
            <p className="font-semibold">{right?.dayRange ?? ""}</p>
            <p className="font-semibold">{right?.timeRange ?? ""}</p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="bg-white p-1 sm:p-1.5 rounded-lg">
                <ContactCallIcon />
              </span>
              <span className="text-sm sm:text-base break-all">
                {right?.phone ?? ""}
              </span>
            </div>
            <div className="border border-dashed !border-white/50" />
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="bg-white p-1 sm:p-1.5 rounded-lg">
                <ContactMailIcon />
              </span>
              <span className="text-sm sm:text-base break-all">
                {right?.email ?? ""}
              </span>
            </div>
            <div className="border border-dashed !border-white/50" />
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="bg-white p-1 sm:p-1.5 rounded-lg">
                <ContactLocationIcon />
              </span>
              <span className="text-sm sm:text-base">
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
