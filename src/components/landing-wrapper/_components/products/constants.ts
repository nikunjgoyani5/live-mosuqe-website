'use client';

// Product sub-images for carousel inside PNG frame
export const PRODUCT_CAROUSEL_IMAGES = [
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
];

// Static image object for read more carousel - can be replaced by real product gallery
export const READMORE_IMAGES: string[] = [
    "https://plus.unsplash.com/premium_photo-1678388570256-73b42955f36b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1581091012184-7c54a4f0b9cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
];

export
    const productData = [
        {
            typeLabel: "Screen App",
            title: "MASJID CLOCK: WORKS WITH OR WITHOUT WI-FI",
            description:
                'This is a Muslim prayer and Iqamah time clock that displays Iqamah times along with additional important information. It is the most advanced Masjid Iqamah wall clock ever created, offering a wide range of features. You can use any display with an HDMI connection (recommended sizes: 32"–65"). Simply download the Masjid Clock app onto an Android device and connect it to your TV or monitor. If there is no Wi‑Fi connection in the masjid we recommend using battery RTC android tv box.',
            imageSrc: "/product1.png",
            platforms: [
                { name: "Amazon", image: "/amazon.png" },
                { name: "eBay", image: "/ebay.png" },
                { name: "PayPal", image: "/paypal.png" },
            ],
            platformTitle: "Order pre-installed Masjid Clock box",
            readMoreLabel: "Read More",
            readMoreHref: "#",
            downloadPlatforms: [
                { name: "Google Play", image: "/googleplay.png" },
                { name: "App Store", image: "/appstore.png" },
            ],
            reverseLayout: false,
        },
        {
            typeLabel: "Mobile App",
            title: "LIVE MOSQUE - IMAM (ADMIN APP)",
            description:
                "With the Imam (Admin) App, you have complete control over the system. Using the Imam app from Live Mosque, imams can perform a variety of tasks with this multi-time-zone clock, including:  Free live streaming of masjid sermons (khutbah) and azan to their subscribers,  Updating Iqamah times (with the option for manual or automatic updates),  Managing Islamic events,  Sending notifications,  Updating display messages,  And accessing other services.",
            imageSrc: "/product2.png",
            platformTitle: "Order pre-installed Masjid Clock box",
            readMoreLabel: "Read More",
            readMoreHref: "#",
            downloadPlatforms: [
                { name: "Google Play", image: "/googleplay.png" },
                { name: "App Store", image: "/appstore.png" },
            ],
            reverseLayout: true,
        },
        {
            typeLabel: "Mobile App",
            title: "LIVE MOSQUE (USER APP)",
            description:
                "Join thousands of Muslims worldwide  who stay connected to their faith through Live Mosque platform. Stay  connected with accurate prayer times from your local masjid, and receive instant alerts for any updates. We understand the importance of prayer in the life of a devoted Muslim,  and our mission is to make it easier for you to observe your daily  prayers with punctuality and devotion. Features include: Masjid Iqamah Times, Live Sermons, Masjid Azan, Quran, Hadith, Learn Quran, Qibla Direction, and Halal Food Locator. Available on iOS and Android",
            imageSrc: "/product3.png",
            readMoreLabel: "Read More",
            readMoreHref: "#",
            downloadPlatforms: [
                { name: "Google Play", image: "/googleplay.png" },
                { name: "App Store", image: "/appstore.png" },
            ],
            reverseLayout: false,
        },
        {
            typeLabel: "Mobile App",
            title: "LIVE MOSQUE - HOME",
            description:
                "Azan Clock for Home - Live Azan and  Iqamah Display: This Azan clock connects to the Live Mosque System,  enabling real-time synchronization with your local mosque. It displays  accurate Iqamah times, streams live Azan and mosque announcements, and  automatically updates notifications based on your zip code. Ideal for  staying spiritually connected from home.",
            imageSrc: "/product4.png",
            platforms: [
                { name: "Amazon", image: "/amazon.png" },
                { name: "eBay", image: "/ebay.png" },
                { name: "PayPal", image: "/paypal.png" },
            ],
            platformTitle: "Order pre-installed Masjid Clock box",
            readMoreLabel: "Read More",
            readMoreHref: "#",
            downloadPlatforms: [
                { name: "Google Play", image: "/googleplay.png" },
                { name: "App Store", image: "/appstore.png" },
            ],
            reverseLayout: true,
        },
    ];
