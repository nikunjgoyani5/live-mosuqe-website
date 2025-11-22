import { ISection } from "@/constants/section.constants";
import { getSectionById } from "@/services/section.service";
import { useCallback, useState } from "react";

export function useSectionData(initialData: ISection) {
  const [data, setData] = useState(initialData);

  const refetch = useCallback(async () => {
    const response: any = await getSectionById(data._id);
    setData(response);
  }, [data.slug]);

  const reset = useCallback(() => {
    setData(initialData);
  }, [initialData]);

  return {
    ...data,
    refetch,
    reset,
  };
}
