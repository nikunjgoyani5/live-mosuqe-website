import AboutIntro from "@/components/landing-wrapper/_components/aboutPage/AboutIntro";
import FoundersVision from "@/components/landing-wrapper/_components/aboutPage/FoundersVision";
import Empowering from "@/components/landing-wrapper/_components/aboutPage/Empowering";
// import Header from "@/components/landing-wrapper/_components/header";
import Footer from "@/components/landing-wrapper/_components/footer";
import { ISections, SECTION_DATA_MAPING, IHeaderContent } from "@/constants/section.constants";
import { getSectionsList } from "@/services/section.service";

export default async function AboutUsPage() {
  const data: ISections | null = await getSectionsList();
  if (!data) return null;

  const aboutIntro = data[SECTION_DATA_MAPING.ABOUTUSPAGE];
  const founderVision = data[SECTION_DATA_MAPING.FOUNDERVISION];
  const empowering = data[SECTION_DATA_MAPING.EMPOWERING];

  return (
    <main>
      {/* <Header data={data[SECTION_DATA_MAPING.HEADER]} /> */}

      <AboutIntro data={aboutIntro} />
      <FoundersVision data={founderVision} />
      <Empowering data={empowering} />
      <Footer
        data={data[SECTION_DATA_MAPING.FOOTER]}
        socialLinks={(data[SECTION_DATA_MAPING.HEADER]?.content as IHeaderContent)?.info?.socials || []}
      />
    </main>
  );
}
