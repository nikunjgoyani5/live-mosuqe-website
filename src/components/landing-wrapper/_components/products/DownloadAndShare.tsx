'use client';

import Image from 'next/image';
import React from 'react';
import { ShareIcon } from '@/constants/icons';
import type { Platform } from './types';

type Props = {
    downloadPlatforms?: Platform[];
    slug?: string; // hash like #product-mobile
};

export const DownloadAndShare: React.FC<Props> = ({ downloadPlatforms = [], slug }) => {
    const [copied, setCopied] = React.useState(false);

    const handleShare = async () => {
        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const hash = slug ?? '';
            const url = `${origin}${hash}`;
            await navigator.clipboard.writeText(url);
            setCopied(true);
            // Hide tooltip after a short delay
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            // no-op: clipboard might not be available
        }
    };
    return (
        <div className="flex flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3">
                {downloadPlatforms.map((p, idx) => {
                    const img = (
                        <Image
                            key={idx}
                            src={p.image}
                            alt={`Get it on ${p.name}`}
                            className="h-full w-full lg:min-h-12 cursor-pointer hover:opacity-80 transition-opacity"
                            width={120}
                            height={110}
                        />
                    );
                    return p.link ? (
                        <a key={idx} href={p.link} target="_blank" rel="noopener noreferrer">{img}</a>
                    ) : (
                        <React.Fragment key={idx}>{img}</React.Fragment>
                    );
                })}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 sm:ml-auto relative">
                <p className="text-dark-100 hover:text-dark-200 text-sm font-semibold text-nowrap">Download It Free</p>
                <button
                    aria-label="Share"
                    onClick={handleShare}
                    className="inline-flex cursor-pointer items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary-color hover:bg-primary-color/90 transition relative"
                >
                    <ShareIcon />
                    {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-gray-900 text-xs font-medium px-2 py-1 rounded shadow">
                            Link copied
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};
