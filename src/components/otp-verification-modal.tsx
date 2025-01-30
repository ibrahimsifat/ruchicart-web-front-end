"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CONSTANT } from "@/lib/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type OtpForm = z.infer<typeof otpSchema>;

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}

export function OtpVerificationModal({
  isOpen,
  onClose,
  phoneNumber,
}: OtpVerificationModalProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const form = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleResendOtp = () => {
    if (!canResend) return;
    setTimeLeft(30);
    setCanResend(false);
    // Add your resend OTP logic here
  };

  const onSubmit = async (data: OtpForm) => {
    console.log("Verifying OTP:", data.otp);
    // Add your OTP verification logic here
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length <= 6 && /^\d*$/.test(value)) {
      form.setValue("otp", value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="flex items-center">
          <Image
            src={CONSTANT.images.logo}
            alt="Stack Food"
            width={200}
            height={60}
            className="mx-auto mb-6"
          />
          <DialogTitle className="text-2xl font-bold">
            OTP Verification
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to
          </p>
          <p className="font-medium">{phoneNumber}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter OTP"
                      className="text-center text-2xl tracking-[1em] font-mono"
                      maxLength={6}
                      onChange={handleOtpChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {canResend ? (
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </Button>
                ) : (
                  `Resend OTP in ${timeLeft}s`
                )}
              </p>
            </div>

            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
