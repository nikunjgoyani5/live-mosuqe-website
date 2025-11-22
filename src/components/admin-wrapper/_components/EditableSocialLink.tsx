"use client";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/constants/icons";
import { useState } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { GoPlus } from "react-icons/go";

// Define the shape of a social link
interface ISocial {
  name: string;
  Icon: React.ElementType;
  url: string;
}

// Initial data for the social links
const initialSocials: ISocial[] = [
  { name: "Facebook", Icon: FacebookIcon, url: "https://facebook.com" },
  { name: "Instagram", Icon: InstagramIcon, url: "https://instagram.com" },
  { name: "LinkedIn", Icon: LinkedInIcon, url: "https://linkedin.com" },
  { name: "Twitter", Icon: TwitterIcon, url: "https://twitter.com" },
];

const socialIconMap: { [key: string]: React.ElementType } = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  Twitter: TwitterIcon,
};

export default function EditableSocialIcons() {
  // State to track which social icon's popover is open
  const [editingSocialName, setEditingSocialName] = useState<string | null>(
    null
  );

  // Set up react-hook-form
  const methods = useFormContext();

  // Get the array of fields from the form state
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "content.info.socials",
  });

  const { register, watch } = methods;

  const currentSocialNames = fields.map((field: any) => field.name);
  const availableSocials = initialSocials.filter(
    (social) => !currentSocialNames.includes(social.name)
  );

  const handleAddNew = () => {
    if (availableSocials.length > 0) {
      append({ name: availableSocials[0].name, url: "" });
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {fields.map((field, index) => {
        const fieldName = watch(`content.info.socials.${index}.name`);
        const SocialIcon = socialIconMap[fieldName] || FacebookIcon; // Default icon

        const isEditing = editingSocialName === field.id;

        return (
          <div
            key={field.id}
            className="relative"
            onClick={() => {
              console.log("Clicked");
            }}
          >
            {/* The Icon that toggles editing mode */}
            <div
              onClick={() => {
                setEditingSocialName(field.id);
              }}
              className="cursor-pointer relative group"
            >
              <SocialIcon />
              <button
                type="button"
                onClick={() => remove(index)}
                className="cursor-pointer text-xs text-red-500 hover:underline absolute -top-3 -right-3 rounded-full p-0.5 group-hover:opacity-100 opacity-0 transition-opacity"
              >
                X
              </button>
            </div>

            {/* The editing popover */}
            {isEditing && (
              <div
                className="fixed top-0 bottom-0 right-0 left-0 z-10 bg-black/0 cursor-default"
                onClick={() => {
                  setEditingSocialName(null);
                }}
              />
            )}
            {isEditing && (
              <div className="absolute top-full mt-2 right-0 z-10 bg-white p-3 rounded-md border shadow-lg w-72">
                <label className="text-xs text-gray-600 block mb-1">
                  Social Media Name
                </label>
                <select
                  {...register(`content.info.socials.${index}.name`)}
                  className="w-full border rounded-md p-1 mb-1 text-sm text-black"
                >
                  <option value={fieldName}>{fieldName}</option>
                  {availableSocials.map((social) => (
                    <option key={social.name} value={social.name}>
                      {social.name}
                    </option>
                  ))}
                </select>

                <label className="text-xs text-gray-600 block mt-2 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  {...register(`content.info.socials.${index}.url`)}
                  className="w-full border rounded-md p-1 text-sm text-black"
                  placeholder={`Enter URL`}
                />

                {/* <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingSocialName(null)} // Close the popover
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Done
                  </button>
                </div> */}
              </div>
            )}
          </div>
        );
      })}
      {initialSocials.length !== fields.length && (
        <Button
          type="button"
          onClick={handleAddNew}
          className="text-sm"
          variant="outline"
          disabled={availableSocials.length === 0}
        >
          <GoPlus />
        </Button>
      )}
    </div>
  );
}
