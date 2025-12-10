import { setCookie, removeCookie } from "@/lib/cookies";
import { Http } from "@/lib/http";

interface ILogin {
  token: string;
}

export const login = async (email: string, password: string) => {
  const data: ILogin = await Http.post("/auth/login", { email, password });
  if (data.token) {
    await setCookie("token", data.token);
  }
  return data;
};
export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const data: any = await Http.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};
export const changeEmail = async (newEmail: string, password: string) => {
  const data: any = await Http.post("/auth/change-email", {
    newEmail,
    password,
  });
  return data;
};

export const logout = async () => {
  await removeCookie("token");
};
