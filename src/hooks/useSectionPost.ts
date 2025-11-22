import { useState, useRef, useMemo, useEffect } from "react";
import { manageMedia, postSection } from "@/services/section.service";

type FormValue = object | string | unknown;

interface FormDataState {
  [key: string]: FormValue;
}

interface UploadMediaState {
  [key: string]: File;
}
export function setNestedValue<T extends Record<string, any>>(
  obj: T,
  path: string | string[],
  value: any,
  insertMode = false // true = insert (splice), false = replace
): T {
  const keys = Array.isArray(path) ? path : path.split(".");
  const newObj: T = structuredClone(obj); // deep clone
  let curr: any = newObj;

  for (let i = 0; i < keys.length; i++) {
    // Extract array index if present (e.g., "data[2]" → key="data", index=2)
    const match = keys[i].match(/^([^\[\]]+)\[(\d+)\]$/);
    const key = match ? match[1] : keys[i];
    const index = match ? parseInt(match[2], 10) : null;

    if (i === keys.length - 1) {
      // Last key in path
      if (index !== null) {
        // Handle array with index
        if (!Array.isArray(curr[key])) curr[key] = [];
        const arr = [...curr[key]];
        if (insertMode) {
          arr.splice(index, 0, value); // insert at index
        } else {
          arr[index] = value; // replace at index
        }
        curr[key] = arr;
      } else {
        curr[key] = value;
      }
    } else {
      // Intermediate path — ensure object/array exists
      if (index !== null) {
        if (!Array.isArray(curr[key])) curr[key] = [];
        if (!curr[key][index]) curr[key][index] = {};
        curr = curr[key][index];
      } else {
        if (typeof curr[key] !== "object" || curr[key] === null) curr[key] = {};
        curr = curr[key];
      }
    }
  }

  return newObj;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!(key in (b as Record<string, unknown>))) return false;

    if (
      !deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    ) {
      return false;
    }
  }

  return true;
}

export function useSection(
  initialFormData: FormDataState = {},
  sectionId: string,
  refetch?: () => void
) {
  const initialRef = useRef<FormDataState>(initialFormData); // hold initial snapshot
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [deletedMedias, setDeletedMedias] = useState<string[]>([]);
  const [uploadMedia, setUploadMedia] = useState<UploadMediaState>({});
  const [openForms, setOpenForms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /** add file to uploadMedia */
  const addUploadMedia = (key: string, file: File) => {
    setUploadMedia((prev) => ({ ...prev, [key]: file }));
  };

  /** mark media for deletion (supports nested keys via dot notation) */
  const markDeletedMedia = (key: string | string[], path?: string) => {
    if (path) setDeletedMedias((prev) => [...prev, path]);
    if (!path)
      setUploadMedia((prev) => {
        if (typeof key === "string") delete prev[key];
        return prev;
      });
    setFormData((prev) => setNestedValue(prev, key, ""));
  };

  const handleOnChange = (name: string, value: FormValue) => {
    setFormData((prev) => setNestedValue(prev, name, value));
  };

  const toggleForm = () => setOpenForms((p) => !p);

  const handleTriggerManageMedia = async (uploadPaths?: {
    uploadMedia: UploadMediaState;
    deletedMedias: string[];
  }) => {
    const { uploadMedia = {}, deletedMedias = [] } = uploadPaths || {};
    if (Object.keys(uploadMedia).length > 0 || deletedMedias.length > 0) {
      const formDataToSend = new FormData();

      if (deletedMedias.length > 0) {
        Object.values(deletedMedias).forEach((file, i) => {
          formDataToSend.append(`deletePaths[${i}]`, file);
        });
      }

      Object.values(uploadMedia).forEach((file) => {
        formDataToSend.append("files", file);
      });

      const { uploaded } = await manageMedia(sectionId, formDataToSend);

      return { uploaded };
    }
    return { uploaded: [] };
  };

  const handleSubmitMedias = async () => {
    setLoading(true);
    let postData: FormDataState = { ...formData };
    console.log("values", formData);

    try {
      console.log(
        "triggering media management",
        uploadMedia,
        Object.keys(uploadMedia).length
      );

      if (Object.keys(uploadMedia).length > 0 || deletedMedias.length > 0) {
        const { uploaded: filePaths } = await handleTriggerManageMedia({
          uploadMedia: uploadMedia,
          deletedMedias: deletedMedias,
        });

        console.log("uploaded file paths", filePaths);

        const keys = Object.keys(uploadMedia);
        keys.forEach((k, idx) => {
          postData = setNestedValue(postData, k, filePaths[idx], true);
        });

        setFormData(postData);
        setUploadMedia({});
        setDeletedMedias([]);
      }

      await postSection(sectionId, { ...postData });

      // ✅ after successful submit, update initialRef to current data
      initialRef.current = postData;
    } catch (err) {
      console.error("while update section", err);
    } finally {
      setLoading(false);
      setOpenForms(false);
    }
  };
  console.log(
    "triggering media management-uploadMedia---uploadMedia-->>",
    uploadMedia
  );

  const handleSubmit = async (values: FormDataState) => {
    setLoading(true);
    let postData = { ...values };
    console.log("values", values);

    try {
      if (Object.keys(uploadMedia).length > 0 || deletedMedias.length > 0) {
        const { uploaded: filePaths } = await handleTriggerManageMedia({
          uploadMedia: uploadMedia,
          deletedMedias: deletedMedias,
        });

        const keys = Object.keys(uploadMedia);
        keys.forEach((k, idx) => {
          postData = setNestedValue(postData, k, filePaths[idx], true);
        });

        setUploadMedia({});
        setDeletedMedias([]);
      }
      setFormData(postData);

      await postSection(sectionId, { ...postData });

      // ✅ after successful submit, update initialRef to current data
      initialRef.current = postData;
      refetch && refetch();
    } catch (err) {
      console.error("while update section", err);
    } finally {
      setLoading(false);
      toggleForm();
    }
  };

  useEffect(() => {
    initialRef.current = initialFormData;
  }, [initialFormData]);

  // ✅ compute isDirty
  const isDirty = useMemo(() => {
    return (
      !deepEqual(formData, initialRef.current) ||
      deletedMedias.length > 0 ||
      Object.keys(uploadMedia).length > 0
    );
  }, [formData, deletedMedias, uploadMedia]);

  return {
    formData,
    openForms,
    loading,
    isDirty, // 👈 new
    handleOnChange,
    toggleForm,
    handleSubmit,
    markDeletedMedia,
    addUploadMedia,
    uploadMedia,
    handleSubmitMedias,
    handleTriggerManageMedia,
  };
}
