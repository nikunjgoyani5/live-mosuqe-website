"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DateBadge } from "@/components/ui/DateBadge";
import {
  CalanderIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  NoImageIcon,
  TwitterIcon,
} from "@/constants/icons";
import { useParams, useRouter } from "next/navigation";
import { ImageOff } from "lucide-react";
import { getSectionsList } from "@/services/section.service";
import { ISections } from "@/constants/section.constants";
import { getFullImageUrl } from "@/lib/utils";
import Loader from "@/components/ui/Loader";
import type { ISection } from "@/constants/section.constants";

type TNews = {
  id: string | number;
  href: string;
  image?: string;
  title: string;
  subtitle: string;
  postdate: string;
  location?: string;
  name?: string;
  rating?: string;
  text?: string;
  content?: string;
  posttime?: string;
};

export default function SingleNewsPage() {
  const params = useParams();
  const router = useRouter();
  const indexNum = Number(params?.id);

  const [posts, setPosts] = useState<TNews[]>([]);
  const [headerData, setHeaderData] = useState<ISection | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const normalizeImage = (src?: string) => {
      // if (!src) return "/serviceside2.png";
      return getFullImageUrl(src || "");
    };
    getSectionsList()
      .then((sections: ISections | null) => {
        if (!sections) return;
        setHeaderData(sections.HEADER);
        const ln: any = (sections.LATEST_NEWS as any) || {};
        const raw: any[] = ln?.content?.data || ln?.data || [];
        const mapped: TNews[] = raw.map((it: any, idx: number) => ({
          image: normalizeImage(it.image),
          title: it.title || "",
          subtitle: it.subtitle || "",
          postdate: it.postdate || "",
          location: it.location || "",
          name: it.name || "",
          rating: it.rating || "",
          text: it.text || "",
          content: it.content || it.subtitle || "",
          id: idx + 1,
          href: `/news/${idx + 1}`,
        }));
        setPosts(mapped);
      })
      .catch((e) => console.error("Error fetching news detail:", e))
      .finally(() => setIsLoading(false));
  }, []);

  const current = useMemo(() => posts[indexNum - 1], [posts, indexNum]);

  // Sidebar search over all posts
  const [query, setQuery] = useState("");
  const recent = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Take last 4 items by index (newest database entries) and reverse to show newest first
    const recentByIndex = posts.slice(-4).reverse();
    if (!q) return recentByIndex;
    return recentByIndex
      .filter((p) =>
        [p.title, p.subtitle].some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 4);
  }, [query, posts]);

  if (isLoading) {
    return <Loader />;
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-primary-color">
            News not found
          </h1>
          <p className="mt-2 text-gray-600">
            We couldn't find the article you're looking for.
          </p>
          <button
            onClick={() => router.push("/news")}
            className="mt-4 rounded-10px bg-primary-color text-white px-5 py-2"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Site Header */}
      {/* <Header data={headerData} /> */}
      {/* Hero */}
      <section className="relative h-[220px] sm:h-[280px] lg:h-[340px] w-full overflow-hidden">
        <Image
          src="/newsPage.png"
          alt="News hero"
          fill
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-semibold tracking-wide">
              NEWS
            </h1>
            <nav className="mt-3 text-xs sm:text-sm opacity-90">
              <ol className="flex items-center justify-center gap-2">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li className="opacity-70">/</li>
                <li>
                  <Link href="/news" className="hover:underline">
                    News
                  </Link>
                </li>
                <li className="opacity-70">/</li>
                <li className="opacity-100 line-clamp-1 max-w-[40vw]">
                  {current?.title || "Detail"}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container-1024 sm:px-6 lg:px-0 py-6 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Left 2/3: image, title, date/time, 4 platforms, content */}
          <article className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden ">
              <div className="relative h-[220px] sm:h-[320px] md:h-[380px] w-full">
                {current?.image ? (
                  <Image
                    src={current.image}
                    alt={current?.title || "News image"}
                    fill
                    className="object-contain rounded-2xl overflow-hidden"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <h2 className="font-cinzel-decorative text-primary-color text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">
                  {current?.title || ""}
                </h2>

                {/* Platforms */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y py-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="mt-3 flex  items-center gap-4 justify-center">
                      <div className="flex items-center gap-1.5">
                        <span>
                          <CalanderIcon />
                        </span>
                        <span className="text-sm font-medium">
                          {current?.postdate}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-1">
                                                <span><ClockIcon /></span>
                                                {current?.posttime ? (
                                                    <span className="text-sm font-medium">{current.posttime}</span>
                                                ) : null}
                                            </div> */}
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-4 text-gray-600 ">
                                        <a aria-label="Share on Facebook" href="#" className="hover:opacity-80"><FacebookIcon /></a>
                                        <a aria-label="Share on Instagram" href="#" className="hover:opacity-80"><InstagramIcon /></a>
                                        <a aria-label="Share on LinkedIn" href="#" className="hover:opacity-80"><LinkedInIcon /></a>
                                        <a aria-label="Share on Twitter" href="#" className="hover:opacity-80"><TwitterIcon /></a>
                                    </div> */}
                </div>

                {/* Content */}
                <div className="prose max-w-none mt-4 text-gray-700 leading-relaxed">
                  {/* <p className="mb-3">{current?.subtitle}</p> */}
                  {(current?.content || "")
                    .split(/\r?\n\s*\r?\n/g) // split paragraphs on blank lines
                    .map((para) => para.trim())
                    .filter(Boolean)
                    .map((para, idx) => (
                      <p
                        key={idx}
                        className="mb-3 whitespace-pre-wrap body-description text-justify"
                      >
                        {para}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </article>

          {/* Right 1/3: same sidebar as list page */}
          <aside className="pl-1 no-scrollbar">
            <div className="rounded-2xl h-full">
              {/* Search */}
              <div className="mb-3">
                <input
                  value={query}
                  onChange={(e) => {
                    // setPage(1);
                    setQuery(e.target.value);
                  }}
                  placeholder="Search"
                  className="w-full rounded-lg border !border-slate px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate/80 text-dark-100 placeholder:text-light-slate"
                />
              </div>

              <h3 className="font-cinzel-decorative section-name-heading-responsive text-primary-color mb-3">
                RECENT POSTS
              </h3>

              <div className="flex flex-col gap-3">
                {recent.length > 0 ? (
                  Array.isArray(recent) &&
                  recent.slice(0, 4).map((item, idx) => (
                    <article
                      key={idx}
                      className="border border-card/90 rounded-2xl p-4 flex gap-3 items-start "
                    >
                      <div className="relative h-28 w-22 lg:h-42 lg:w-32 overflow-hidden rounded-xl shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <ImageOff className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-primary-color uppercase tracking-wide line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs sm:text-sm font-medium text-gray-700 leading-relaxed break-words line-clamp-3">
                          {item.subtitle}
                        </p>
                        <DateBadge
                          variant="primary"
                          className="mt-2 inline-block"
                        >
                          {item.postdate}
                        </DateBadge>
                      </div>
                    </article>
                  ))
                ) : (
                  <article className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] md:grid-cols-[160px_1fr] gap-3 rounded-xl border bg-card/60 p-4 h-full overflow-hidden min-h-[220px] sm:min-h-[240px] md:min-h-[170px] lg:min-h-[150px]">
                    {/* Placeholder image */}
                    <div className="relative overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                      <NoImageIcon />
                    </div>
                    {/* Centered message */}
                    <div className="flex items-center justify-center text-center">
                      <h4 className="text-base sm:text-lg md:text-xl font-semibold text-primary-color">
                        No data found
                      </h4>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
