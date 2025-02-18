"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import defaultConfig from "@/config/config";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Copy, Linkedin, Share2, Twitter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const socialLinks = [
  {
    name: "Facebook Messenger",
    icon: "/messenger.svg",
    shareUrl: "https://www.messenger.com/share?u=",
    color: "bg-[#0084ff]",
  },
  {
    name: "Twitter",
    icon: Twitter,
    shareUrl: "https://twitter.com/intent/tweet?text=",
    color: "bg-[#1DA1F2]",
  },
  {
    name: "WhatsApp",
    icon: "/whatsapp.svg",
    shareUrl: "https://wa.me/?text=",
    color: "bg-[#25D366]",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    shareUrl: "https://www.linkedin.com/sharing/share-offsite/?url=",
    color: "bg-[#0A66C2]",
  },
];

const steps = [
  {
    number: "1",
    title: "Invite and share your code",
    description: "Share your referral code with friends & family members",
  },
  {
    number: "2",
    title: "Friends join & order",
    description:
      "They create a account on StackFood using your code and place their first order",
  },
  {
    number: "3",
    title: "You earn rewards",
    description: "You made your earning when the order is complete",
  },
];

export default function ReferralPage() {
  const [copying, setCopying] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const referralCode = user?.refer_code || "No Code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopying(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (platform: string) => {
    const shareText = `Use my referral code ${referralCode} to get $10.00 off your first order on StackFood!`;
    const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;

    const url = platform + encodeURIComponent(shareText + " " + shareUrl);
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="overflow-hidden">
        <CardHeader className="text-center border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <CardTitle className="text-2xl font-bold">Refer & Earn</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-square md:aspect-auto md:h-[300px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Af1Mt6rzZujc9N5XUXCjiTr9I5e9h4.png"
                alt="Referral Illustration"
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold mb-2">
                  Share Your Love for Food!
                </h2>
                <p className="text-muted-foreground">
                  Refer your code to your friends and get{" "}
                  <span className="text-primary font-semibold">
                    {defaultConfig.currency_symbol}10.00 on joining
                  </span>{" "}
                  for every referral!
                </p>
              </div>

              {/* Referral Code */}
              <div className="flex gap-2">
                <Card className="flex-1">
                  <CardContent className="p-3">
                    <code className="text-lg font-mono">{referralCode}</code>
                  </CardContent>
                </Card>
                <Button
                  variant="outline"
                  size="icon"
                  className="aspect-square h-auto"
                  onClick={handleCopy}
                >
                  <Copy
                    className={`h-4 w-4 ${copying ? "text-green-500" : ""}`}
                  />
                </Button>
              </div>

              {/* Social Share */}
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">
                  OR SHARE VIA
                </p>
                <div className="flex justify-center gap-3">
                  {socialLinks.map((social) => (
                    <motion.button
                      key={social.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${social.color} p-2 rounded-full text-white`}
                      onClick={() => handleShare(social.shareUrl)}
                    >
                      {typeof social.icon === "string" ? (
                        <Image
                          src={social.icon || "/placeholder.svg"}
                          alt={social.name}
                          width={24}
                          height={24}
                        />
                      ) : (
                        <social.icon className="h-6 w-6" />
                      )}
                    </motion.button>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-200 p-2 rounded-full"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Join StackFood",
                          text: `Use my referral code ${referralCode} to get $10.00 off your first order!`,
                          url: `${window.location.origin}/signup?ref=${referralCode}`,
                        });
                      }
                    }}
                  >
                    <Share2 className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-6 text-center">
              How it works?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step) => (
                <Card
                  key={step.number}
                  className="relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary transform origin-left transition-transform group-hover:scale-x-100" />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {step.number}
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
