'use client';

import Image from 'next/image';
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { READMORE_IMAGES } from './constants';

type Props = {
    title: string;
    trigger: React.ReactNode; // Button rendered as child via asChild
};

export const ReadMoreDialog: React.FC<Props> = ({ title, trigger }) => {
    const [mainApi, setMainApi] = React.useState<CarouselApi | null>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const thumbsRef = React.useRef<HTMLDivElement | null>(null);
    const dragState = React.useRef({ isDown: false, startX: 0, scrollLeft: 0 });
    const dragMovedRef = React.useRef(false);
    const [dragging, setDragging] = React.useState(false);

    React.useEffect(() => {
        if (!mainApi) return;
        const onSelect = () => setActiveIndex(mainApi.selectedScrollSnap());
        mainApi.on('select', onSelect);
        setActiveIndex(mainApi.selectedScrollSnap());
        return () => {
            mainApi.off('select', onSelect);
        };
    }, [mainApi]);

    const centerActiveThumb = React.useCallback(() => {
        const container = thumbsRef.current;
        if (!container) return;
        const activeEl = container.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement | null;
        if (!activeEl) return;
        const targetLeft = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
        container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }, [activeIndex]);

    React.useEffect(() => {
        centerActiveThumb();
    }, [centerActiveThumb]);

    const onThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = thumbsRef.current;
        if (!el) return;
        dragState.current.isDown = true;
        dragState.current.startX = e.clientX;
        dragState.current.scrollLeft = el.scrollLeft;
        dragMovedRef.current = false;
        setDragging(true);
        el.classList.add('dragging');
        try {
            (e.target as Element)?.setPointerCapture?.(e.pointerId);
        } catch { }
    };

    const onThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = thumbsRef.current;
        if (!el || !dragState.current.isDown) return;
        const dx = e.clientX - dragState.current.startX;
        if (Math.abs(dx) > 3) dragMovedRef.current = true;
        el.scrollLeft = dragState.current.scrollLeft - dx;
    };

    const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
        if (!dragState.current.isDown) return;
        dragState.current.isDown = false;
        setDragging(false);
        thumbsRef.current?.classList.remove('dragging');
        try {
            if (e) (e.target as Element)?.releasePointerCapture?.(e.pointerId);
        } catch { }
    };

    const handleThumbClick = (index: number) => {
        if (dragMovedRef.current) return;
        mainApi?.scrollTo(index);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

            <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] rounded-xl overflow-hidden ">

                {/* Main Carousel (square, fits viewport to avoid scrollbars) */}
                <div className="w-full flex justify-center mb-4">
                    <div
                        className="relative rounded-lg overflow-hidden aspect-square"
                        style={{ width: "min(90vw, 70vh)" }}
                    >
                        <Carousel
                            autoplay
                            className="h-full w-full"
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            setApi={(api) => setMainApi(api)} // <-- capture carousel API
                        >
                            <CarouselContent className="h-full" viewportClassName="h-full">
                                {READMORE_IMAGES.map((image, index) => (
                                    <CarouselItem key={index} className="h-full">
                                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`${title} - Image ${index + 1}`}
                                                fill
                                                className="object-cover w-full h-full"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {/* Place arrows inside the square so they aren't clipped by overflow-hidden */}
                            <CarouselPrevious className="!border-none !shadow-none left-2 text-white text-2xl bg-primary-color/50 rounded-lg cursor-pointer w-6 h-6" />
                            <CarouselNext className="!border-none !shadow-none right-2 text-white bg-primary-color/50 !rounded-lg cursor-pointer w-6 h-6" />
                        </Carousel>
                    </div>
                </div>

                {/* Thumbnails: constrain width to match main square */}
                <div className="w-full flex justify-center">
                    <div style={{ width: "min(90vw, 70vh)" }}>
                        <div
                            className={`mt-3 rounded-xl p-3 overflow-x-auto no-scrollbar ${dragging ? "dragging" : ""}`}
                            ref={thumbsRef}
                            onPointerDown={onThumbPointerDown}
                            onPointerMove={onThumbPointerMove}
                            onPointerUp={endDrag}
                            onPointerLeave={endDrag}
                        >
                            <div className="flex items-center gap-4 min-w-max cursor-grab">
                                {READMORE_IMAGES.map((thumb, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        data-index={index}
                                        onClick={() => handleThumbClick(index)} // <-- jump to image
                                        className={`relative w-16 h-16 shrink-0 rounded-md overflow-hidden ring-offset-2 transition-all duration-200 cursor-pointer ${activeIndex === index
                                            ? "ring-2 ring-primary-color "
                                            : "opacity-95 hover:opacity-95"}
                          `}
                                        aria-label={`Go to image ${index + 1}`}
                                    >
                                        <Image
                                            src={thumb}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                        {activeIndex !== index && (
                                            <span className="absolute inset-0 bg-black/10" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
