import {
  CONTACT_DUMMY_CONFIG,
  ContactConfig,
} from "@/constants/contact.constants";
import { Http } from "@/lib/http";

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

// Contact form: send message to backend
export interface SendMessagePayload {
  email: string;
  f_name: string;
  l_name: string;
  message: string;
  otp: string | null;
  phone_number: string;
}

export async function sendContactMessage(payload: SendMessagePayload) {
  // Absolute URL so it bypasses the local axios baseURL
  const url =
    "https://livemosque.live/backend/public/index.php/api/send-message";
  return Http.post<unknown>(url, payload, {
    headers: { "Content-Type": "application/json" },
  });
}
