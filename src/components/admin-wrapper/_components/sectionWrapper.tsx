"use client";
import React, { ReactNode, useState } from "react";
import { PiPencilSimple } from "react-icons/pi";
import { LuCheck } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { useSection } from "@/hooks/useSectionPost";
import SectionTitle from "./sectionTitle";

interface IProps {
  title: string;
  sectionId: string;
  children: ReactNode;
  visible?: boolean;
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
  visible,
}: IProps) {
  const {
    handleSubmit,
    handleOnChange,
    formData,
    openForms,
    toggleForm,
    loading,
  } = useSection(
    {
      name: title,
    },
    sectionId
  );
  const [isVisible, setIsVisible] = useState<boolean>(
    visible === undefined ? true : visible
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
            {!openForms && (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isVisible}
                  disabled={loading}
                  onChange={(e) => {
                    e.stopPropagation();
                    // if the current state is undefined and user toggles off, set to false
                    // otherwise toggle boolean
                    const next = e.target.checked;
                    // if user unchecked (next === false) that's explicit false
                    // if user checked (next === true) explicit true
                    const vis = next ? true : false;
                    setIsVisible(vis);
                    handleSubmit({ ...formData, visible: vis });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                    <div className="w-4 h-4 border-2 !border-primary-color !border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </label>
            )}
            {addButton && !openForms && (
              <div className="flex items-center">
                <GoPlus
                  className="btn-icon"
                  size="35"
                  onClick={() => {
                    if (onAdd) onAdd();
                  }}
                />
              </div>
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
