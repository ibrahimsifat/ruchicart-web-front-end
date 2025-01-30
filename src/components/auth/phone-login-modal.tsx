"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONSTANT } from "@/lib/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as z from "zod";

const phoneLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  countryCode: z.string().default("+1"),
  rememberMe: z.boolean().default(false),
});

type PhoneLoginForm = z.infer<typeof phoneLoginSchema>;

interface PhoneLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOTP: (phoneNumber: string) => void;
}

export function PhoneLoginModal({
  isOpen,
  onClose,
  onOpenOTP,
}: PhoneLoginModalProps) {
  const form = useForm<PhoneLoginForm>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: "",
      countryCode: "+1",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: PhoneLoginForm) => {
    const fullPhone = `${data.countryCode}${data.phone}`;
    onOpenOTP(fullPhone);
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
          <DialogTitle className="text-2xl font-bold">Login</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Select
                        value={form.watch("countryCode")}
                        onValueChange={(value) =>
                          form.setValue("countryCode", value)
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+1">🇺🇸 +1</SelectItem>
                          <SelectItem value="+44">🇬🇧 +44</SelectItem>
                          <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Phone number"
                        {...field}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={form.watch("rememberMe")}
                onCheckedChange={(checked) =>
                  form.setValue("rememberMe", checked as boolean)
                }
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              * By login I Agree with all the{" "}
              <Button variant="link" className="h-auto p-0 text-xs">
                Terms & Conditions
              </Button>
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
