"use client";
import Dropzone from "@/components/ui/DropZone";
import { useSection } from "@/hooks/useSectionPost";
import StateButton from "@/components/ui/StateButton";
import FormProvider from "@/context/FormProvider";
import TextInput from "@/components/ui/forms/TextInput";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { IMenu, IOption, ISection } from "@/constants/section.constants";
import SectionWrapper from "./_components/sectionWrapper";
import { GoPlus } from "react-icons/go";
import CreatableSelectInput from "../ui/forms/CreatableSelectInput";
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
  pathOptions?: IOption[];
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
  } = useSortable({ id: `footer-menu-item-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group px-2 py-1 cursor-pointer border border-gray-200 rounded ${
        index === activeMenu ? "font-bold bg-blue-50 border-blue-300" : ""
      } ${isDragging ? "z-10" : ""}`}
      onClick={() => setActiveMenu(index)}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-2 cursor-grab active:cursor-grabbing bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity rounded-l"
      />

      <div className="pl-3">{item.label || `Menu ${index + 1}`}</div>

      {/* Close icon on hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // avoid triggering onClick
          removeItem(index);
        }}
        className="absolute -top-2 -right-2 opacity-100 bg-white rounded-full p-0.5 cursor-pointer shadow-md"
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
        (_: IMenu, index: number) => `footer-menu-item-${index}` === active.id
      );
      const overIndex = data.findIndex(
        (_: IMenu, index: number) => `footer-menu-item-${index}` === over?.id
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
    const updated: IOption[] = data.filter(
      (_: IOption, i: number) => i !== index
    );
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
      {Array.isArray(data) && data.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <SortableContext
              items={data.map(
                (_: IMenu, index: number) => `footer-menu-item-${index}`
              )}
              strategy={verticalListSortingStrategy}
            >
              {data.map((item: IMenu, i: number) => (
                <SortableMenuItem
                  key={`footer-menu-item-${i}`}
                  item={item}
                  index={i}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  removeItem={removeItem}
                />
              ))}
            </SortableContext>
            <button
              className="px-3 py-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
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
      {Array.isArray(data) &&
        data.length > 0 &&
        data.map((_: IMenu, i: number) => i === activeMenu && showNewEdit(i))}
    </>
  );
};

export default function FooterSection({ data, pathOptions = [] }: IProps) {
  const { content, _id: sectionId, name, visible } = data;
  const {
    handleSubmit,
    formData,
    loading,
    addUploadMedia,
    markDeletedMedia,
    uploadMedia,
  } = useSection(
    {
      content: content,
    },
    sectionId
  );

  if (content && (content as any).info && !(content as any).info.socials) {
    (content as any).info.socials = [
      { name: "Facebook", url: "https://facebook.com" },
      { name: "Twitter", url: "https://twitter.com" },
    ];
  }

  return (
    <SectionWrapper sectionId={sectionId} title={name} visible={visible}>
      <FormProvider
        onSubmit={handleSubmit}
        options={{
          defaultValues: formData,
        }}
      >
        <MenuItems options={pathOptions} />
        {/* <div className="w-full flex"> */}
        {/* <div className="w-1/2">
            <Dropzone
              name="content.image"
              files={uploadMedia}
              onAddFile={addUploadMedia}
              onDeleteFile={(key, path) => {
                if (path) markDeletedMedia(key, path);
                else {
                  // remove from uploadMedia directly
                  // you can implement removeUploadMedia in hook
                }
              }}
              variant="image"
              existingFiles={
                (formData.content as Record<string, string>)?.image
                  ? [
                    {
                      path: (formData.content as Record<string, string>)
                        .image,
                      key: "content.image",
                    },
                  ]
                  : []
              }
            />
          </div> */}
        {/* <EditableSocialIcons />
        </div>
        <br /> */}
        <TextInput name="content.copyright" label="Copyright" />
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
