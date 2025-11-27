import { ISections } from "@/constants/section.constants";
import { Http } from "@/lib/http";

export const getSectionsList = async () => {
  try {
    const data: ISections = await Http.get("/sections");
    return data;
  } catch (e) {
    console.log("while getting sections", e);
    // During build time, if API is not available, return a basic structure
    // that components can handle safely
    return null;
  }
};

export const getSectionById = async (id: string) => {
  try {
    const data = await Http.get(`/sections/${id}`);
    return data;
  } catch (e) {
    console.log("while getting sections", e);
    return null;
  }
};

export const postSection = async (id: string, formData: object = {}) => {
  try {
    const data = await Http.patch(`/sections/${id}`, formData);
    return data;
  } catch (e) {
    console.log("while getting sections", e);
    return null;
  }
};

interface IManageMediaResponse {
  uploaded: string[];
  deleted: string[];
}

export const manageMedia = async (
  id: string,
  formData: object = {}
): Promise<IManageMediaResponse> => {
  try {
    const data: IManageMediaResponse = await Http.post(
      `/files/manage`,
      formData
    );
    return data;
  } catch (e) {
    console.log("while getting sections", e);
    throw e;
  }
};
