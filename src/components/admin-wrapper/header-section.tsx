"use client";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import SectionWrapper from "./_components/sectionWrapper";
import { LuPhoneCall } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { X } from "lucide-react";
import { GoPlus } from "react-icons/go";
import { IMenu, IOption, ISection } from "@/constants/section.constants";
import CreatableSelectInput from "../ui/forms/CreatableSelectInput";
import Image from "next/image";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/constants/icons";
import EditableSocialIcons from "./_components/EditableSocialLink";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IProps {
  data: ISection;
  pathOptions: IOption[];
}

// Sortable Menu Item Component
const SortableMenuItem = ({
  item,
  index,
  activeMenu,
  setActiveMenu,
  removeItem,
}: {
  item: IMenu;
  index: number;
  activeMenu: number | null;
  setActiveMenu: (index: number) => void;
  removeItem: (index: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `menu-item-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group px-2 py-1 cursor-pointer border border-gray-200 rounded max-w-[150px]
          ${
            index === activeMenu ? "font-bold bg-blue-50 border-blue-300 " : ""
          } ${isDragging ? "z-10" : ""}`}
      onClick={() => setActiveMenu(index)}
      title={item.label || `Menu ${index + 1}`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-2 cursor-grab active:cursor-grabbing bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity rounded-l text-nowrap"
      />

      <div className=" text-ellipsis overflow-hidden w-full text-nowrap line-clamp-1">
        {item.label || `Menu ${index + 1}`}
      </div>

      {/* Close icon: always visible on desktop, hover on mobile */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // avoid triggering onClick
          removeItem(index);
        }}
        className="absolute -top-2 -right-2 opacity-100 sm:opacity-100 group-hover:opacity-100 transition-opacity bg-white rounded-full p-0.5 cursor-pointer shadow-md"
        // On mobile, only show on hover; on desktop (sm:), always visible
        style={{
          opacity: undefined,
        }}
      >
        <X className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
};

const MenuItems = ({ options = [] }: { options: IOption[] }) => {
  const { watch, setValue } = useFormContext();
  const [activeMenu, setActiveMenu] = useState<number | null>(0);

  const data = watch("content.data") || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeIndex = data.findIndex(
        (_: IMenu, index: number) => `menu-item-${index}` === active.id
      );
      const overIndex = data.findIndex(
        (_: IMenu, index: number) => `menu-item-${index}` === over?.id
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedData = arrayMove(data, activeIndex, overIndex);
        setValue("content.data", reorderedData, { shouldDirty: true });

        // Update active menu index
        if (activeMenu === activeIndex) {
          setActiveMenu(overIndex);
        } else if (activeMenu === overIndex) {
          setActiveMenu(activeIndex);
        } else if (activeMenu !== null) {
          if (activeIndex < activeMenu && overIndex >= activeMenu) {
            setActiveMenu(activeMenu - 1);
          } else if (activeIndex > activeMenu && overIndex <= activeMenu) {
            setActiveMenu(activeMenu + 1);
          }
        }
      }
    }
  };

  // remove item at index
  const removeItem = (index: number) => {
    const updated = data.filter((_: IMenu, i: number) => i !== index);
    setValue("content.data", updated, { shouldDirty: true });
    if (activeMenu === index) {
      setActiveMenu(updated.length > 0 ? 0 : null);
    } else if (activeMenu !== null && activeMenu > index) {
      setActiveMenu(activeMenu - 1);
    }
  };

  // add item at the end of the list
  const addItem = () => {
    const newIndex = data.length;
    const updated = [
      ...data,
      { label: `Menu ${newIndex + 1}`, path: `Menu-${newIndex + 1}` },
    ];
    setValue("content.data", updated, { shouldDirty: true });
    // Don't auto-select the new item, keep current selection
  };

  const showNewEdit = (index: number) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
      <TextInput name={`content.data.${index}.label`} label="Menu name" />
      <CreatableSelectInput
        name={`content.data.${index}.path`}
        label="Menu path"
        placeholder="Add or select path"
        options={options}
      />
    </div>
  );

  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-5">
            <Image
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 xl:w-14 xl:h-14 rounded-lg"
              width={70}
              height={70}
            />
          </div>
          <div className="w-full lg:w-auto">
            {Array.isArray(data) && data.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <SortableContext
                    items={data.map(
                      (_: IMenu, index: number) => `menu-item-${index}`
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    {data.map((item: IMenu, i: number) => (
                      <SortableMenuItem
                        key={`menu-item-${i}`}
                        item={item}
                        index={i}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        removeItem={removeItem}
                      />
                    ))}
                  </SortableContext>
                  <button
                    className="px-3 py-3 border rounded hover:bg-gray-50 transition-colors"
                    type="button"
                    onClick={() => {
                      addItem();
                    }}
                  >
                    <GoPlus />
                  </button>
                </div>
              </DndContext>
            )}
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <StateButton type="button" className="text-sm sm:text-base">
              Register Your Masjid
            </StateButton>
          </div>
        </div>
      </div>

      {Array.isArray(data) &&
        data.length > 0 &&
        data.map((_: IMenu, i: number) => (
          <div key={i}>{i === activeMenu && showNewEdit(i)}</div>
        ))}
    </>
  );
};

export default function HeaderSection({ data, pathOptions = [] }: IProps) {
  const { content, _id: sectionId, name, visible } = data;

  if (content && (content as any).info && !(content as any).info.socials) {
    (content as any).info.socials = [
      { name: "Facebook", url: "https://facebook.com" },
      { name: "Twitter", url: "https://twitter.com" },
    ];
  }

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
        <div>
          <label className="section-label">Header Logo + Menu</label>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full lg:w-auto">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <LuPhoneCall className="" size="25" />
                <TextInput name="content.info.phone" />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <FaWhatsapp className="" size="25" />
                <TextInput name="content.info.whatsapp" />
              </div>
            </div>
            <div className="flex cursor-pointer items-center gap-3 text-sm">
              <EditableSocialIcons />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <MdOutlineMailOutline className="" size="25" />
              <TextInput name="content.info.email" />
            </div>
          </div>
        </div>
        <hr />

        <MenuItems options={pathOptions} />

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
