import { CardData } from "@/constants/type.constants";
import Image from "next/image";

// const defaultCardData: CardData = {
//     decorativeImage: {
//         src: "/taj4.svg",
//         alt: "Triangle Notch"
//     },
//     mainImage: {
//         src: "/cardLeft.png",
//         alt: "Card Illustration"
//     },
//     title: "In Masjid Displays",
//     description: "Masjid Clock Displays and use our masjid clock picture",
//     styles: {
//         titleColor: "text-blue-400",
//         titleFont: "font-cinzel",
//         descriptionFont: "font-montserrat"
//     }
// };

interface CardProps {
  showInnerImage?: boolean;
  title?: string;
  description?: string;
  cardData?: Partial<CardData>;
}

export default function Card({
  showInnerImage = true,
  title,
  description,
  cardData,
}: CardProps) {
  const finalCardData = {
    ...cardData,
    title: title || cardData?.title,
    description: description || cardData?.description,
  };
  return (
    <main className="flex items-center justify-center  ">
      <div className="">
        <div className="flex justify-center">
          <div className="relative">
            {/* Decorative top image */}
            <div className="absolute z-10 bottom-[100%] left-1/2 transform -translate-x-1/2 mb-[-1px]">
              <Image
                src={"/taj4.svg"}
                alt={"taj4.svg"}
                className="w-full h-full"
                width={40}
                height={40}
              />
            </div>

            {/* Card */}
            <div className="z-10 w-full rounded-2xl h-full bg-secondary-color pb-1 border-none">
              <div className="rounded-xl relative overflow-hidden border-none bg-white flex flex-col md:flex-row p-4 gap-4 max-w-md md:max-w-sm h-28">
                {/* Image section */}
                {showInnerImage && (
                  <div className="flex-shrink-0 w-full md:w-1/3">
                    <Image
                      src={String(finalCardData.mainImage?.src)}
                      alt={String(finalCardData.mainImage?.alt)}
                      className="w-full h-40 md:max-h-20 object-cover rounded-xl"
                      width={200}
                      height={200}
                    />
                  </div>
                )}

                {/* Text section */}
                <div className="flex flex-col justify-center gap-2 w-full h-full overflow-hidden ">
                  {finalCardData.title && (
                    <div
                      className={`${finalCardData.styles?.titleFont} font-bold ${finalCardData.styles?.titleColor} text-xl md:text-2xl text-center md:text-left`}
                    >
                      {finalCardData.title}
                    </div>
                  )}
                  <div
                    title={finalCardData?.description}
                    className={`${finalCardData.styles?.descriptionFont} text-dark-100 leading-5.5 text-sm font-medium md:text-left font-montserrat overflow-hidden text-ellipsis cursor-default `}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {finalCardData?.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

{
  /* <div className=" bg-[#E2C69E] pb-1.5 rounded-2xl w-96 h-24 relative overflow-hidden border-none"> */
}
{
  /* <div className="z-10 w-full rounded-2xl h-full bg-white border-none"> */
}
