import Image from "next/image";
import React from "react";

function WelcomeSection() {
  return (
    <div className="p-4">
      <div className="bg-primary-color py-5 px-10 rounded-[20px] text-white flex items-center gap-5 justify-between">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 xl:w-14 xl:h-14 rounded-lg"
            width={70}
            height={70}
          />
        </div>
        <h1 className="xl:text-[25px] text-xl font-semibold">
          Welcome to Live Mosque
        </h1>
        <div className="flex items-center">
          <Image
            src="/user.svg"
            alt="User"
            className="w-8 h-8 xl:w-8 xl:h-8 rounded-lg"
            width={34}
            height={34}
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
