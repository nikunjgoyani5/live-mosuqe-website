"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DateBadge } from "@/components/ui/DateBadge";
import { LeftArrowIcon } from "@/constants/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";


export function SideCard({ item, maxLines = 5, className = "" }: { item: any, maxLines?: number; className?: string }) {
    const router = useRouter();
    // Handle both old (NewsItem) and new (INewsItem) data structures
    const title = item.title || "";
    const excerpt = item.excerpt || item.subtitle || "";
    const date = item.date || item.postdate || "";
    const image = item.image || "/serviceside1.png";
    const readMoreLink = item.href || `#`;

    // Clamp body copy a bit tighter on smaller screens so the controls don't overflow
    const clampClass = "line-clamp-3 sm:line-clamp-4 md:line-clamp-10";

    return (
        <article className={`grid  grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] md:grid-cols-[260px_1fr] gap-3 rounded-xl border bg-card/60 p-4 h-full overflow-hidden ${className}`}>
            {/* Image */}
            <div className="relative overflow-hidden rounded-lg">
                <Image
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    width={400}
                    height={200}
                />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between min-h-0 min-w-0">
                <div className="flex-1">
                    <h4 className="title text-sm sm:text-lg md:text-xl font-semibold font-cinzel-decorative text-primary-color leading-snug mb-1 break-words line-clamp-2">
                        {title}
                    </h4>
                    <p
                        className={`text-xs sm:text-sm font-medium text-gray-700 leading-relaxed break-words ${clampClass}`}
                    >
                        {excerpt}
                    </p>
                </div>

                <div className="mt-2 flex flex-col md:flex-row items-center justify-between gap-2">
                    <PrimaryButton
                        className="text-xs w-full md:w-auto px-3 py-1.5 sm:px-3.5 sm:py-2"
                        onClick={() => {
                            if (readMoreLink && readMoreLink !== '#') {
                                router.push(readMoreLink);
                            }
                        }}
                    >
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
