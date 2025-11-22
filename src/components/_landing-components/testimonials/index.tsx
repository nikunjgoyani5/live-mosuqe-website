"use client";
import React, { useState } from "react";
import TestimonialCard from "@/components/testimonial/TestimonialCard";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { LeftArrowIcon } from "@/constants/icons";
import { ISection, ITestimonialsContent } from "@/constants/section.constants";

interface IProps {
    data?: ISection;
}

// Dummy data (5 items)
const testimonials = [
    {
        id: 1,
        quote: "This is an amazing App, by far the best one in the market. As an Imam my experience is that it made every musullin's life 100 times easier This is an amazing App, by far the best one in the market. As an Imam my experience is that it made every musullin's life 100 times easier This is an amazing App, by far the best one in the market. As an Imam my experience is that it made every musullin's life 100 times easier",
        name: "Ahmad Faisal",
        location: "New York",
        address: " 123, Baker Street, NY",
        rating: 4.1,
        avatar: "/product1.png",
    },
    {
        id: 2,
        quote: "I love the live mosque app. It helps display the Salat time clearly and sends notifications to all members. It is also a great tool to ...",
        name: "Ibrahima",
        location: "New York",
        address: " 456, Elm Street, NY",
        rating: 3.7,
        avatar: "/product2.png",
    },
    {
        id: 3,
        quote: "The service has helped me integrate religious practices and teachings into my daily routines....",
        name: "Nuruddin",
        location: "New York",
        address: " 789, Pine Street, NY",
        rating: 4.5,
        avatar: "/product3.png",
    },
    {
        id: 4,
        quote: "Great UI and seamless experience. Our community stays informed and engaged like never before.",
        name: "Fatima",
        location: "New York",
        address: " 321, Oak Street, NY",
        rating: 4.8,
        avatar: "/product4.png",
    },
    {
        id: 5,
        quote: "Notifications are timely and accurate. Setup was quick and the support is fantastic!",
        name: "Hassan",
        location: "New York",
        address: " 654, Maple Street, NY",
        rating: 4.6,
        avatar: "/product2.png",
    },
];

export default function TestimonialsLanding({ data }: IProps) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();

    // Type guard and data extraction
    const testimonialsContent = (data?.content && 'title' in data.content && 'data' in data.content)
        ? data.content as unknown as ITestimonialsContent
        : null;

    const testimonialsData = testimonialsContent?.data || testimonials;
    const sectionTitle = testimonialsContent?.title || "OUR USERS DESCRIBE US BEST";

    return (
        <section
            id="testimonials"
            className="scroll-section relative w-full py-16 md:py-20 bg-primary-color overflow-hidden bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/tesimonials_pattern.png)" }}
        >
            <div className="relative px-4 md:px-8">
                <div className="flex flex-col items-center text-center mb-10 md:mb-14">
                    <img src="/testimonialMasid.png" alt="Description" className="mb-4 h-14 w-12" />
                    <h2 className="font-cinzel heading-responsive text-secondary-color font-semibold tracking-wide">
                        {sectionTitle.toUpperCase()}
                    </h2>
                </div>
                <div className="relative container mx-auto max-w-7xl overflow-visible">
                    {/* Navigation buttons positioned outside the carousel */}
                    <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-secondary-color border-none text-primary-color hover:bg-secondary-color/80 cursor-pointer shadow-lg w-12 h-12 rounded-xl disabled:opacity-50 rotate-180 z-20 hidden md:flex items-center justify-center transition-all duration-200 hover:scale-105
                                sm:left-4
                                md:left-6
                                lg:left-8
                                xl:-left-6"
                        onClick={() => carouselApi?.scrollPrev()}
                        aria-label="Previous testimonial"
                    >
                        <LeftArrowIcon color="#102f82" />
                    </button>

                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary-color border-none text-primary-color hover:bg-secondary-color/80 cursor-pointer shadow-lg w-12 h-12 rounded-xl disabled:opacity-50 z-20 hidden md:flex items-center justify-center transition-all duration-200 hover:scale-105
                                sm:right-4
                                md:right-6
                                lg:right-8
                                xl:-right-6"
                        onClick={() => carouselApi?.scrollNext()}
                        aria-label="Next testimonial"
                    >
                        <LeftArrowIcon color="#102f82" />
                    </button>

                    <div className=" sm:pr-20 sm:pl-16   md:pr-24 md:pl-20 lg:pr-28 lg:pl-26 xl:pr-16 xl:pl-14">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                                slidesToScroll: 1,
                                containScroll: "trimSnaps"
                            }}
                            className="w-full overflow-visible"
                            autoplay={{ delay: 4000, pauseOnHover: true }}
                            setApi={setCarouselApi}
                        >
                            {/* On mobile, add equal padding on both sides and remove negative margin; keep existing spacing from sm and up */}
                            <CarouselContent viewportClassName="px-4 sm:px-0" className="overflow-visible mx-auto w-full ">
                                {testimonialsData.map((testimonial: any, index) => {
                                    // Handle both old (dummy) and new (server) data structures
                                    const quote = testimonial.quote || testimonial.text || "";
                                    const name = testimonial.name || "";
                                    const location = testimonial.location || "";
                                    const rating = parseFloat(testimonial.rating?.toString() || "0");
                                    const avatar = testimonial.avatar || testimonial.image || "/product1.png";
                                    const address = testimonial.address || location;

                                    return (
                                        <CarouselItem
                                            key={testimonial.id || index}
                                            className={`basis-full sm:basis-1/1 md:basis-1/2 xl:basis-1/3 px-4 sm:px-0 sm:pl-6  flex justify-center`}
                                        >
                                            <div className="w-full max-w-[380px]">
                                                <TestimonialCard
                                                    quote={quote}
                                                    name={name}
                                                    location={location}
                                                    rating={rating}
                                                    avatar={avatar}
                                                    address={address}
                                                />
                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}
