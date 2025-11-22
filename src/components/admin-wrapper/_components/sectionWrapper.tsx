"use client";
import React, { ReactNode } from "react";
import { PiPencilSimple } from "react-icons/pi";
import { LuCheck } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { useSection } from "@/hooks/useSectionPost";
import SectionTitle from "./sectionTitle";

interface IProps {
  title: string;
  sectionId: string;
  children: ReactNode;
  addButton?: boolean;
  onAdd?: () => void;
  onDelete?: () => void;
}

export default function SectionWrapper({
  sectionId,
  title,
  children,
  addButton,
  onAdd,
  onDelete,
}: IProps) {
  const { handleSubmit, handleOnChange, formData, openForms, toggleForm } =
    useSection(
      {
        name: title,
      },
      sectionId
    );

  const sectionTitle = (
    <SectionTitle
      title={String(formData["name"])}
      isFormOpen={openForms}
      onChange={(val) => {
        handleOnChange("name", val);
      }}
      onBlur={() => {
        handleSubmit(formData);
      }}
    />
  );
  return (
    <div className="p-4">
      <div className="section-wrapper">
        <div className="section-header">
          {sectionTitle}
          <div className="action-buttons pl-3">
            {addButton && !openForms && (
              <GoPlus className="btn-icon" size="35" onClick={onAdd} />
            )}
            {openForms && (
              <LuCheck
                className="btn-icon"
                size="35"
                onClick={() => handleSubmit(formData)}
              />
            )}
            {!openForms && (
              <PiPencilSimple
                className="btn-icon"
                size="35"
                onClick={() => toggleForm()}
              />
            )}
            {!openForms && onDelete && (
              <PiPencilSimple
                className="btn-icon"
                size="35"
                onClick={() => onDelete()}
              />
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
