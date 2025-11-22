"use client";
// import Dropzone from "@/components/ui/DropZone";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import TextareaField from "../ui/forms/TextareaField";
import { ISection } from "@/constants/section.constants";
import SectionWrapper from "./_components/sectionWrapper";

interface IProps {
  data: ISection;
}

export default function ContactSection({ data }: IProps) {
  const { content, _id: sectionId, name, visible } = data;
  const { handleSubmit, formData, loading } = useSection(
    {
      content: content,
    },
    sectionId
  );

  return (
    <SectionWrapper sectionId={sectionId} title={name} visible={visible}>
      <FormProvider
        onSubmit={handleSubmit}
        options={{
          defaultValues: formData,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-x-5">
          <div className="lg:col-span-2 space-y-4">
            <TextInput name="content.title" label="Heading" />
            <TextInput name="content.description" label="Sub heading" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-x-5 space-y-5">
              <label className="text-sm font-medium col-span-1 sm:col-span-2">
                Edit Form
              </label>
              <TextInput
                name="content.form.first_name"
                placeholder="First Name"
              />
              <TextInput
                name="content.form.last_name"
                placeholder="Last Name"
              />
              <TextInput name="content.form.email" placeholder="Email" />
              <TextInput name="content.form.phone" placeholder="Phone" />
              <div className="col-span-1 sm:col-span-2 space-y-4">
                <TextareaField
                  name="content.form.message"
                  placeholder="Message"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <TextInput name="content.office_title" label="Office Title" />
            <TextInput name="content.office_hours" label="Office hours" />
            <TextInput name="content.call" label="Phone" />
            <TextInput name="content.email" label="Email" />
            <TextInput name="content.location" label="Location" />
          </div>
        </div>

        <StateButton
          loading={loading}
          type="submit"
          className="mt-4"
          disabled={loading}
        >
          Save
        </StateButton>
      </FormProvider>
    </SectionWrapper>
  );
}
