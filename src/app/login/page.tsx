import LoginForm from "@/components/login/loginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const token = (await cookies()).get("token");

  if (token) {
    return redirect("/admin");
  }

  return <LoginForm />;
}
