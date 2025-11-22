import AboutIntro from "@/components/landing-wrapper/_components/aboutPage/AboutIntro";
import FoundersVision from "@/components/landing-wrapper/_components/aboutPage/FoundersVision";
import Empowering from "@/components/landing-wrapper/_components/aboutPage/Empowering";
// import Header from "@/components/landing-wrapper/_components/header";
import Footer from "@/components/landing-wrapper/_components/footer";
import {
  ISections,
  SECTION_DATA_MAPING,
  IHeaderContent,
} from "@/constants/section.constants";
import { getSectionsList } from "@/services/section.service";
import Donation from "@/components/landing-wrapper/_components/donationPage/Donation";

export default async function DonationPage() {
  const data: ISections | null = await getSectionsList();
  if (!data) return null;

  const aboutIntro = data[SECTION_DATA_MAPING.DONATION];

  return (
    <main>
      <Donation data={aboutIntro} />
      <Footer
        data={data[SECTION_DATA_MAPING.FOOTER]}
        socialLinks={
          (data[SECTION_DATA_MAPING.HEADER]?.content as IHeaderContent)?.info
            ?.socials || []
        }
      />
    </main>
  );
}
