"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CONSTANT } from "@/config/constants";
import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Bell } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ComingSoonProps {
  title?: string;
  description?: string;
  illustration?: string;
  className?: string;
  showNotifyForm?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function ComingSoon({
  title = "Coming Soon!",
  description = "We're working hard to bring you something amazing. Stay tuned!",
  illustration = "/coming-soon.svg",
  className,
  showNotifyForm = true,
  showBackButton = true,
  onBackClick,
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to save the email
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Thank you!",
        description: "We'll notify you when this feature becomes available.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-[80vh] flex items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-4xl">
        {showBackButton && (
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => onBackClick?.()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-card  overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />

          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {title}
                </h1>
                <p className="text-muted-foreground">{description}</p>
              </motion.div>

              {showNotifyForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <p className="text-sm font-medium">
                    Want to be notified when this feature is ready?
                  </p>
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      <Bell className="mr-2 h-4 w-4" />
                      Notify Me
                    </Button>
                  </form>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative aspect-square md:aspect-auto md:h-[400px]"
            >
              <Image
                src={CONSTANT.images.comingSoon || "/placeholder.svg"}
                alt="Coming Soon Illustration"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        </motion.div>
      </div>
    </div>
  );
}
