export type FieldType = "text" | "number" | "textarea" | "select";

export interface ContactFieldOption {
  label: string;
  value: string | number;
}

export interface ContactFieldBase {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export type ContactField =
  | (ContactFieldBase & {
      type: "text" | "number";
      defaultValue?: string | number;
    })
  | (ContactFieldBase & {
      type: "textarea";
      rows?: number;
      defaultValue?: string;
    })
  | (ContactFieldBase & {
      type: "select";
      options: ContactFieldOption[];
      defaultValue?: string | number;
    });

export interface ContactLeftContent {
  logoSrc?: string;
  heading: string;
  description: string;
  submitText: string;
}

export interface ContactRightInfo {
  officeHoursLabel: string; // e.g., "Our office hours are"
  dayRange: string; // e.g., "Monday to Friday"
  timeRange: string; // e.g., "12 PM to 9 PM EST"
  phone: string;
  email: string;
  address: string;
}

export interface ContactConfig {
  left: ContactLeftContent;
  right: ContactRightInfo;
  form: {
    fields: ContactField[];
  };
}

// Shared input classes required by the user
export const CONTACT_INPUT_CLASS =
    "w-full rounded-2xl border !border-slate px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate/80 text-dark-100 placeholder:text-light-slate";

// Dummy config to be replaced by API response in future
export const CONTACT_DUMMY_CONFIG: ContactConfig = {
  left: {
    logoSrc: "/Searviceheader.png",
    heading: "LET’S CONNECT CONSTELLATIONS",
    description:
      "Questions, comments or feedback, please feel free to reach us.",
    submitText: "Submit",
  },
  right: {
    officeHoursLabel: "Our office hours are",
    dayRange: "Monday to Friday",
    timeRange: "12 PM to 9 PM EST",
    phone: "+1-347-302-8394",
    email: "info@livemosque.live",
    address: "New York, USA",
  },
  form: {
    fields: [
      {
        id: "firstName",
        name: "firstName",
        type: "text",
        placeholder: "First Name",
        required: true,
      },
      {
        id: "lastName",
        name: "lastName",
        type: "text",
        placeholder: "Last Name",
      },
      {
        id: "email",
        name: "email",
        type: "text",
        placeholder: "Email",
        required: true,
      },
      { id: "phone", name: "phone", type: "text", placeholder: "Phone Number" },
      {
        id: "message",
        name: "message",
        type: "textarea",
        placeholder: "Message",
        rows: 4,
      },
      // {
      //     id: "topic",
      //     name: "topic",
      //     type: "select",
      //     label: "Topic",
      //     placeholder: "Select a topic",
      //     options: [
      //         { label: "General", value: "general" },
      //         { label: "Support", value: "support" },
      //         { label: "Partnership", value: "partnership" },
      //     ],
      // },
      // { id: "age", name: "age", type: "number", label: "Age", placeholder: "Age" },
    ],
  },
};
