"use client";

import Image from "next/image";
import Link from "next/link";
import { DateBadge } from "@/components/ui/DateBadge";
import { useEffect, useMemo, useState } from "react";
import { SideCard } from "@/components/news/seeAllSideCard";
import { LeftArrowIcon2, NoImageIcon } from "@/constants/icons";
import { ISections, INewsItem, ISection } from "@/constants/section.constants";
import { getSectionsList } from "@/services/section.service";
import { BASE_URL } from "@/lib/axios";
// import Header from "@/components/landing-wrapper/_components/header";

export default function NewsPage() {
  // Posts state (fetched from sections API -> LATEST_NEWS)
  // Widen type to include local navigation fields
  const [posts, setPosts] = useState<
    (INewsItem & { id: string | number; href: string })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [headerData, setHeaderData] = useState<ISection | undefined>(undefined);

  console.log(posts, "posts");
  // Fetch sections and extract Latest News posts
  useEffect(() => {
    const normalizeImage = (src?: string) => {
      if (!src) return "/serviceside1.png";
      // Prefix API base for uploads served by backend
      if (src.startsWith("/uploads/")) return `${BASE_URL}${src}`;
      return src;
    };

    getSectionsList()
      .then((sections: ISections | null) => {
        if (!sections) return;
        // Capture header section for global header component
        // setHeaderData(sections.HEADER);
        const ln = (sections.LATEST_NEWS as any) || {};
        // Some payloads have content.data; fall back to ln.content?.data || ln.data
        const raw: any[] = ln?.content?.data || ln?.data || [];
        const mapped = raw.map((it: any, idx: number) => ({
          image: normalizeImage(it.image),
          title: it.title || "",
          subtitle: it.subtitle || "",
          postdate: it.postdate || "",
          location: it.location || "",
          name: it.name || "",
          rating: it.rating || "",
          text: it.text || "",
          // local navigation fields
          id: it.id || it._id || idx + 1,
          href: `/news/${it.id || it._id || idx + 1}`,
        }));

        setPosts(mapped);
      })
      .catch((error) => {
        console.error("Error fetching sections data:", error);
      })
      .finally(() => setIsLoading(false));
  }, []);
  // Search and pagination state
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 3;

  // Filter posts by title/subtitle
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.title, p.subtitle].some((t) => t.toLowerCase().includes(q))
    );
  }, [query, posts]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const pagedPosts = filtered.slice(start, start + perPage);
  const showEmpty = !isLoading && filtered.length === 0;

  // Sidebar recent posts: show 4 most recent by postdate (not affected by search)
  const recentPosts = useMemo(() => {
    const parseDate = (d: string) => {
      const ts = Date.parse(d);
      return isNaN(ts) ? 0 : ts;
    };
    return [...posts]
      .sort((a, b) => parseDate(b.postdate) - parseDate(a.postdate))
      .slice(0, 4);
  }, [posts]);

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Site Header */}
      {/* <Header data={headerData} /> */}
      {/* Hero section with image and breadcrumb */}
      <section className="relative h-[220px] sm:h-[280px] lg:h-[340px] w-full overflow-hidden">
        <Image
          src="/newsPage.png"
          alt="News hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute  inset-0 bg-black/40" />
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
                <li className="opacity-100">News</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Content area */}
      <section className="container-1024 sm:px-6 lg:px-0 py-6 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Left column (2/3) auto height, no scrollbars */}
          <div className="lg:col-span-2 pr-1 no-scrollbar">
            <div className="flex flex-col gap-4">
              {showEmpty ? (
                <article className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] md:grid-cols-[260px_1fr] gap-3 rounded-xl border bg-card/60 p-4 h-full overflow-hidden min-h-[220px] sm:min-h-[240px] md:min-h-[260px] lg:min-h-[280px]">
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
              ) : (
                pagedPosts.map((item, idx) => (
                  <SideCard
                    key={`${start + idx}-${item.title}`}
                    item={item}
                    maxLines={10}
                    className="min-h-[220px] sm:min-h-[240px] md:min-h-[260px] lg:min-h-[280px]"
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {showEmpty ? null : (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-10px flex cursor-pointer border  px-5 py-2 text-sm font-medium bg-primary-color justify-center items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-color/90"
                  aria-label="Previous page"
                >
                  <span className="rotate-180">
                    <LeftArrowIcon2 />
                  </span>
                  <span className="text-sm text-white">Prev</span>
                </button>
                {/* <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span> */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-10px cursor-pointer border px-5 py-2 text-sm font-medium bg-primary-color gap-1 items-center flex disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-color/90"
                  aria-label="Next page"
                >
                  <span className="text-sm text-white">Next</span>
                  <span>
                    <LeftArrowIcon2 />
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Right column (1/3) auto height, hide any scrollbars; card stretches to match row height */}
          <aside className="pl-1 no-scrollbar">
            <div className="rounded-2xl h-full">
              {/* Search */}
              <div className="mb-3">
                <input
                  value={query}
                  onChange={(e) => {
                    setPage(1);
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
                {recentPosts.map((item, idx) => (
                  <article
                    key={idx}
                    className="border border-card/90 rounded-2xl p-4 flex gap-3 items-start "
                  >
                    <div className="relative h-28 w-22 lg:h-42 lg:w-32 overflow-hidden rounded-xl shrink-0">
                      <Image
                        src={item.image || "/serviceside1.png"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
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
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
