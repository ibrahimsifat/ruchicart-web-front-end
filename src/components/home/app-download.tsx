import { CONSTANT } from "@/lib/utils/constants";
import Image from "next/image";

export function AppDownload() {
  return (
    <div className="grid md:grid-cols-2  items-center  bg-[#fff9c0] rounded-3xl  my-10">
      <div className="relative h-[600px] order-2 md:order-1">
        <div className=" ">
          <Image
            src={`/mobile-hand-modal.webp`}
            alt="App interface"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center text-white text-4xl font-bold p-4">
          New
        </div>
      </div>
      <div className="space-y-6 order-1 md:order-2">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-800 leading-tight">
            Experience convenience <br />
            at your fingertips
          </h2>
          <p className="text-xl text-gray-600">
            All your favorite restaurants, just a tap away
          </p>
          <p className="text-gray-500">
            Download our app now and enjoy exclusive offers!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#"
            className="block w-[160px] transform hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={CONSTANT.images.playStore}
              alt="Get it on Google Play"
              width={160}
              height={42}
              className="h-auto"
            />
          </a>
          <a
            href="#"
            className="block w-[160px] transform hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={CONSTANT.images.appleStore}
              alt="Download on the App Store"
              width={160}
              height={42}
              className="h-auto"
            />
          </a>
        </div>
        <div className="mt-8 flex items-center gap-2 text-gray-600">
          <span className="text-3xl font-bold animate-pulse">🎉</span>
          <p>Join over 1 million happy users today!</p>
        </div>
      </div>
    </div>
  );
}
