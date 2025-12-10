import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsPage from "./_setting_from";

export default async function DashboardPage() {
  const token = (await cookies()).get("token");

  if (!token) {
    return redirect("/login");
  }

  return <SettingsPage />;
}
