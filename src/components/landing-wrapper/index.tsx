import TestimonialsLanding from "@/components/_landing-components/testimonials";
import AboutSection from "@/components/landing-wrapper/_components/aboutUs";
import Hero from "@/components/landing-wrapper/_components/hero";
import LatestNews from "@/components/landing-wrapper/_components/news/LatestNews";
import ProductComponent from "@/components/landing-wrapper/_components/products";
import ContactSection from "./_components/contactUs";
import Footer from "./_components/footer";
import Header from "./_components/header";
import LiveMosqueSection from "./_components/livemosque";
import { ISections } from "@/constants/section.constants";

interface IProps {
  data?: ISections;
}

export default function LandinnWrapper({ data }: IProps) {

  if (!data) return null
  return (
    <main>
      <Header data={data?.HEADER} />
      <Hero data={data?.HERO_BANNER} />
      <LatestNews data={data?.LATEST_NEWS} />
      <LiveMosqueSection data={data?.SERVICES} />
      <AboutSection data={data?.ABOUTUS} />
      <ProductComponent data={data?.PRODUCTS} />
      <TestimonialsLanding data={data?.TESTIMONIALS} />
      <ContactSection data={data?.CONTACTUS} />
      <Footer data={data?.FOOTER} />
    </main>
  );
}
