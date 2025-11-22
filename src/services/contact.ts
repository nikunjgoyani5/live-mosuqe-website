import {
  CONTACT_DUMMY_CONFIG,
  ContactConfig,
} from "@/constants/contact.constants";

// In the future, replace with real endpoint and remove fallback
export async function fetchContactConfig(): Promise<ContactConfig> {
  try {
    // Example real call (commented until endpoint exists)
    // const { data } = await api.get<ContactConfig>("/contact/config");
    // return data;
    return Promise.resolve(CONTACT_DUMMY_CONFIG);
  } catch (e) {
    console.log(e);
    return CONTACT_DUMMY_CONFIG;
  }
}
