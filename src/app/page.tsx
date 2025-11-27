export const revalidate = 0;
export const dynamic = "force-dynamic";

import LandinnWrapper from "@/components/landing-wrapper";
import { ISections } from "@/constants/section.constants";
import { getSectionsList } from "@/services/section.service";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Home() {
  // Temporarily disable API call during build to test if that's the issue
  let data: ISections | null = null;

  try {
    await delay(2000);
    data = await getSectionsList();
  } catch (error) {
    console.warn("API call failed during build, using fallback data:", error);
    // Fallback to null, components should handle this gracefully
    data = null;
  }

  // Always render the component, let it handle missing data with fallbacks
  return <LandinnWrapper data={data || undefined} />;
}
