"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DateBadge } from "@/components/ui/DateBadge";
import { LeftArrowIcon } from "@/constants/icons";
import { featuredNews, latestNews, NewsItem } from "@/constants/news.constants";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ISection, ILatestNewsContent, INewsItem } from "@/constants/section.constants";
import { BASE_URL } from "@/lib/axios";

// Union type for both news item formats
type UnifiedNewsItem = NewsItem | INewsItem;

// Type guards
function isNewsItem(item: UnifiedNewsItem): item is NewsItem {
  return 'excerpt' in item && 'date' in item && 'href' in item;
}

function isINewsItem(item: UnifiedNewsItem): item is INewsItem {
  return 'subtitle' in item && 'postdate' in item;
}

interface IProps {
  data?: ISection;
}

export default function LatestNews({ data }: IProps) {
  // Type guard to check if content is latest news content
  const newsContent = (data?.content && 'data' in data.content)
    ? data.content as ILatestNewsContent
    : null;

  // Get news data from server or use default
  const newsData: UnifiedNewsItem[] = newsContent?.data || latestNews;

  // Find featured news (first item or one marked as featured)
  const featuredNewsItem = newsData[0];
  const sideNews = newsData.slice(1, 4); // Show up to 3 side news items

  return (
    <div className="w-full h-full bg-[#F4F4F4]">
      <section id="latest-news" className="scroll-section container-1024 sm:px-6 lg:px-0 py-6 sm:py-10 md:py-12 pb-6 sm:pb-10 md:pb-[100px]">
        <Header />

        <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-5 sm:gap-6 lg:mt-8 lg:grid-cols-2 lg:gap-8">
          {/* Left Featured Card */}
          <FeaturedCard className="lg:h-full" item={featuredNewsItem} />

          {/* Right SideCards */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:h-full">
            {sideNews.slice(0, 2).map((n, index) => (
              <SideCard key={index} item={n} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Header() {
  const router = useRouter();

  return (
    <div>
      <Image
        src="/Searviceheader.png"
        alt=""
        className="mb-2 h-12 w-10 "
        width={32}
        height={40}
      />
      <div className="flex gap-3 flex-row items-center justify-between">
        <h2 className="text-primary-color section-name-heading-responsive font-cinzel">
          LATEST NEWS
        </h2>

        <PrimaryButton
          className="self-start sm:self-auto text-xs sm:text-sm"
          onClick={() => router.push('/news')}
        >
          <span>View All</span>
          <LeftArrowIcon />
        </PrimaryButton>
      </div>
    </div>
  );
}

interface FeaturedCardProps {
  className?: string;
  item: UnifiedNewsItem;
  index?: number; // used to build /news/[id] fallback
}

// Ensure image works for API paths like /uploads/...
const normalizeImage = (src?: string) => {
  if (!src) return "/serviceLeftside1.png";
  if (src.startsWith("/uploads/")) return `${BASE_URL}${src}`;
  return src;
};

function FeaturedCard({ className = "", item, index = 0 }: FeaturedCardProps) {
  const router = useRouter();
  // Handle both old (NewsItem) and new (INewsItem) data structures
  const n = item || featuredNews;
  const title = n.title || "";

  let excerpt = "";
  let date = "";
  let readMoreLink = "#"; // used for legacy NewsItem

  if (isNewsItem(n)) {
    excerpt = n.excerpt || "";
    date = n.date || "";
    readMoreLink = n.href || "#";
  } else if (isINewsItem(n)) {
    excerpt = n.subtitle || "";
    date = n.postdate || "";
    readMoreLink = n.read_more || n["read more"] || "#";
  }

  const image = normalizeImage((n as any).image) || "/serviceLeftside1.png";

  const handleReadMore = () => {
    if (isINewsItem(n)) {
      const nid = (n as any).id || (n as any)._id || index + 1;
      router.push(`/news/${nid}`);
      return;
    }
    if (isNewsItem(n)) {
      if (readMoreLink && readMoreLink.startsWith('/news/')) {
        router.push(readMoreLink);
      } else if (readMoreLink && readMoreLink !== '#') {
        window.open(readMoreLink, '_blank');
      } else {
        router.push('/news');
      }
    }
  };

  return (
    <article
      className={
        "relative flex flex-col justify-end overflow-hidden rounded-2xl h-full sm:h-[500px] " +
        className
      }
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay: darker at bottom, lighter at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0"></div>

      {/* Content Overlay */}
      <div className="relative z-10 p-4 sm:p-6 text-white">
        <h3
          className="text-lg sm:text-xl font-cinzel-decorative font-semibold leading-snug line-clamp-2 md:line-clamp-1"
          title={title}
        >
          {title}
        </h3>
        <p className="mt-2 text-sm line-clamp-3">{excerpt}</p>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <PrimaryButton className="text-sm sm:text-base" onClick={handleReadMore}>
            <span>Read More</span>
            <LeftArrowIcon />
          </PrimaryButton>
          <DateBadge variant="light">{date}</DateBadge>
        </div>
      </div>
    </article>
  );
}

function SideCard({ item, index = 1 }: { item: any; index?: number }) {
  const router = useRouter();
  // Handle both old (NewsItem) and new (INewsItem) data structures
  const title = item.title || "";
  const excerpt = item.excerpt || item.subtitle || "";
  const date = item.date || item.postdate || "";
  const image = normalizeImage(item.image) || "/serviceside1.png";
  const readMoreLink = item.href || item.read_more || item["read more"] || "#";

  const handleReadMore = () => {
    if (isINewsItem(item)) {
      const nid = (item as any).id || (item as any)._id || index + 1;
      router.push(`/news/${nid}`);
      return;
    }
    if (isNewsItem(item)) {
      if (readMoreLink && readMoreLink.startsWith('/news/')) {
        router.push(readMoreLink);
      } else if (readMoreLink && readMoreLink !== '#') {
        window.open(readMoreLink, '_blank');
      } else {
        router.push('/news');
      }
    }
  };

  return (
    <article className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] md:grid-cols-[165px_1fr] gap-3 rounded-xl border bg-card/60 p-2 h-full">
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          width={200}
          height={200}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between min-h-0">
        <div className="flex-1">
          <h4
            className="title text-sm sm:text-lg md:text-xl font-semibold font-cinzel-decorative text-primary-color leading-snug mb-1 line-clamp-2 sm:line-clamp-1"
            title={title}
          >
            {title}
          </h4>
          <p className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed line-clamp-5 min-h-[6.125rem] sm:min-h-[7.125rem]">
            {excerpt}
          </p>
        </div>

        <div className="mt-2 flex flex-col md:flex-row items-center justify-between gap-2">
          <PrimaryButton className="text-xs w-full md:w-auto px-3 py-1.5 sm:px-3.5 sm:py-2" onClick={handleReadMore}>
            <span>Read More</span>
            <LeftArrowIcon />
          </PrimaryButton>
          <DateBadge variant="primary" className="whitespace-nowrap">
            {date}
          </DateBadge>
        </div>
      </div>
    </article>
  );
}
