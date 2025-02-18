"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONSTANT } from "@/config/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Gift, Percent, QrCode, Smartphone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
const AppPromotion = () => {
  const [showQR, setShowQR] = useState(false);
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/20 text-primary-text-primary-text">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,#000_100%)] opacity-10" />
          <div className="relative p-6 grid gap-6 md:grid-cols-[1fr,120px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  <h3 className="font-semibold">Get Our Mobile App</h3>
                </div>
                <p className="text-sm opacity-90">
                  Download our app and get exclusive offers:
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="h-4 w-4" />
                  <span>$10 off on your first order</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="h-4 w-4" />
                  <span>Extra 5% off on all orders</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Priority delivery service</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="relative h-10 w-32"
                  asChild
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Image
                      src={CONSTANT.images.appleStore}
                      alt="Download on the App Store"
                      fill
                      className="object-contain"
                    />
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="relative h-10 w-32"
                  asChild
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Image
                      src={CONSTANT.images.playStore}
                      alt="Get it on Google Play"
                      fill
                      className="object-contain"
                    />
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="relative"
                  onClick={() => setShowQR(!showQR)}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>

              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white rounded-lg p-2 w-32">
                      <Image
                        src="/app-qr-code.png"
                        alt="App QR Code"
                        width={120}
                        height={120}
                        className="w-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative hidden md:block">
              <Image
                src={CONSTANT.images.mobileDownload}
                alt="Mobile App Screenshot"
                width={120}
                height={240}
                className="absolute bottom-0 right-0"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppPromotion;
