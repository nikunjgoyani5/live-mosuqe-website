"use client";

import Image from "next/image";
import { ISection } from "@/constants/section.constants";
import { BASE_URL } from "@/lib/axios";

interface IProps {
    data?: ISection;
}

const toUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
};

export default function Empowering({ data }: IProps) {
    const content = (data?.content as Record<string, any>) || {};
    const title: string = content.title || "Empowering Masjids Worldwide";
    const description: string = content.description || "";
    const mediaUrl = toUrl(content.media_url) || "/singleNews.png";

    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="mx-auto w-full max-w-[1320px] px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left image framed */}
                <div className="order-1">
                    <div className="rounded-3xl overflow-hidden shadow-sm border border-black/5">
                        <Image
                            src={mediaUrl}
                            alt={title}
                            width={900}
                            height={650}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Right copy */}
                <div className="order-2">
                    <h2 className="heading-responsive 2xl:max-w-2xl  font-bold text-primary-color leading-snug font-cinzel-decorative max-w-xl">
                        {title}
                    </h2>
                    <div className="text-dark-100 mt-5 body-description max-w-xl 2xl:max-w-2xl pb-8 sm:pb-8">
                        {description
                            .toString()
                            .split(/\n+/)
                            .map((line: string, i: number) => (
                                <p key={i}>{line}</p>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
