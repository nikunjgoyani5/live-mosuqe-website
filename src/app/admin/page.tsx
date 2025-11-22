import AdminWrapper from "@/components/admin-wrapper/index";
import { ISections } from "@/constants/section.constants";
import { getSectionsList } from "@/services/section.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const data: ISections | null = await getSectionsList();
  const token = (await cookies()).get("token");

  if (!token || data === null) {
    return redirect("/login");
  }

  return <AdminWrapper data={data} />;
}
