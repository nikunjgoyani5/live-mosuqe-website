import { useState, useRef, useMemo, useEffect } from "react";
import { manageMedia, postSection } from "@/services/section.service";
import toast from "react-hot-toast";

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

  /** add file to uploadMedia with validation */
  const addUploadMedia = async (key: string, file: File) => {
    try {
      // Validate MIME type
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/avi",
        "video/mov",
      ];
      if (!allowedMimeTypes.includes(file.type)) {
        throw new Error(
          "Unsupported file format. Please upload a JPEG, PNG, GIF, MP4, AVI, or MOV."
        );
      }

      // Validate file size (e.g., max 20MB)
      const maxSizeInMB = 20;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        throw new Error(
          `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`
        );
      }

      // If all validations pass, add the file to uploadMedia
      setUploadMedia((prev) => ({ ...prev, [key]: file }));
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file. Please try again.");
    }
  };

  /** mark media for deletion (supports nested keys via dot notation) */
  const markDeletedMedia = (
    key: string | string[],
    path?: string,
    formDataSave: boolean = true
  ) => {
    if (path) setDeletedMedias((prev) => [...prev, path]);
    if (!path)
      setUploadMedia((prev) => {
        if (typeof key === "string") delete prev[key];
        return prev;
      });
    if (formDataSave) setFormData((prev) => setNestedValue(prev, key, ""));
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

      const { uploaded, deleted } = await manageMedia(
        sectionId,
        formDataToSend
      );

      return { uploaded, deleted };
    }
    return { uploaded: [], deleted: [] };
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

        if (filePaths.length) {
          const keys = Object.keys(uploadMedia);
          keys.forEach((k, idx) => {
            postData = setNestedValue(postData, k, filePaths[idx], true);
          });
        }

        setFormData(postData);
        setUploadMedia({});
        setDeletedMedias([]);
      }

      await postSection(sectionId, { ...postData });

      // ✅ after successful submit, update initialRef to current data
      initialRef.current = postData;
    } catch (err) {
      console.error("while update section", err);
      setUploadMedia({});
      setDeletedMedias([]);
      toast.error("media upload failed, please try again!");
    } finally {
      setLoading(false);
      setOpenForms(false);
    }
  };

  const handleSubmit = async (values: FormDataState) => {
    setLoading(true);
    let postData = { ...values };

    try {
      if (Object.keys(uploadMedia).length > 0 || deletedMedias.length > 0) {
        const { uploaded: filePaths } = await handleTriggerManageMedia({
          uploadMedia: uploadMedia,
          deletedMedias: deletedMedias,
        });

        if (filePaths.length) {
          const keys = Object.keys(uploadMedia);
          keys.forEach((k, idx) => {
            postData = setNestedValue(postData, k, filePaths[idx], true);
          });
        }

        setUploadMedia({});
        setDeletedMedias([]);
      }
      setFormData(postData);

      await postSection(sectionId, { ...postData });

      // ✅ after successful submit, update initialRef to current data
      initialRef.current = postData;
      refetch && refetch();
    } catch (err: any) {
      console.error("while update section", err);
      setUploadMedia({});
      setDeletedMedias([]);
      toast.error(err?.message || "Error updating section. Please try again.");
    } finally {
      setLoading(false);
      setOpenForms(false);
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
