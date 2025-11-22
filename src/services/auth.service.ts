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

export const logout = async () => {
  await removeCookie("token");
};
