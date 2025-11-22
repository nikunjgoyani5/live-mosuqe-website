'use client';

import Image from 'next/image';
import React from 'react';
import type { Platform } from './types';

type Props = {
    platforms: Platform[];
    platformTitle?: string;
};

export const PlatformGrid: React.FC<Props> = ({ platforms, platformTitle }) => {
    if (!platformTitle || platforms.length === 0) return null;
    return (
        <div>
            <p className="text-sm md:text-lg font-cinzel-decorative font-semibold text-primary-color mb-3">
                {platformTitle}
            </p>
            <div className="grid cursor-pointer grid-cols-3 gap-3">
                {platforms.map((p, idx) => {
                    const content = (
                        <>
                            <span className="font-montserrat text-xs sm:text-sm text-dark-100 font-medium text-center">
                                Buy Now On
                            </span>
                            <Image
                                src={p.image}
                                alt={p.name}
                                className="h-8 sm:h-8 w-full object-contain"
                                width={128}
                                height={128}
                                quality={100}
                                priority
                            />
                        </>
                    );
                    return (
                        <div
                            key={idx}
                            className="bg-white rounded-xl px-3 py-2 sm:px-3 sm:py-3 flex flex-col gap-1 sm:gap-2 items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                        >
                            {p.link ? (
                                <a href={p.link} target="_blank" rel="noopener noreferrer" className="w-full h-full flex flex-col items-center justify-center">
                                    {content}
                                </a>
                            ) : (
                                content
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
