import { StarIcon } from "@/constants/icons";
import React from "react";
import { ImageOff } from "lucide-react";

export interface TestimonialCardProps {
    quote: string;
    name: string;
    location: string;
    rating: number | string;
    avatar?: string; // image path
    address: string;
}

export default function TestimonialCard({ quote, name, location, rating, avatar, address }: TestimonialCardProps) {
    return (
        <div className="relative flex justify-center">
            <div className="relative w-full max-w-[520px] md:pt-8 mx-auto">
                <div className="flex items-start justify-center pointer-events-none select-none mx-auto">
                    <img src="/taj4.svg" alt="taj4" className="h-8 w-auto" />
                </div>
                <div className="rounded-2xl bg-white  px-6 pt-6 pb-6 flex flex-col h-[230px]">
                    <div className="flex-1 overflow-hidden md:mb-6">
                        <p
                            className="font-montserrat text-sm md:text-sm font-medium  text-dark-gray overflow-hidden line-clamp-4 leading-6 text-ellipsis text-justify"
                        >
                            {quote}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                            {avatar ? (
                                <img src={avatar} alt={name} className="w-full h-full object-contain" />
                            ) : (
                                <ImageOff className="w-6 h-6 text-gray-400" />
                            )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                                <p className="font-montserrat font-semibold text-primary-color text-sm truncate">{name}, <span className="text-primary-color font-semibold">{location}</span></p>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs md:text-sm font-normal text-dark-100">{address}</span>
                                <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1 text-xs font-montserrat font-medium text-dark-100">
                                    <StarIcon />
                                    <span>{rating}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
