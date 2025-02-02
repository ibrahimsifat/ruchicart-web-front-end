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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const phoneSchema = z.object({
  phone: z
    .string()
    .regex(
      /^(\+8801|8801|01)[3-9]{1}[0-9]{8}$/,
      "Invalid Bangladeshi phone number"
    ),
});

interface GooglePhoneVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  googleUserData: any;
}

export function GooglePhoneVerification({
  isOpen,
  onClose,
  googleUserData,
}: GooglePhoneVerificationProps) {
  const router = useRouter();
  const { registerWithSocialMedia, error, isLoading, getProfileInfo } =
    useAuthStore();

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof phoneSchema>) => {
    console.log(googleUserData);
    try {
      // Register with complete data
      await registerWithSocialMedia({
        name: googleUserData?.name,
        email: googleUserData?.email,
        phone: values.phone,
        unique_id: googleUserData?.unique_id,
        token: googleUserData?.token,
        medium: "google",
      });
      getProfileInfo();
      router.push("/");
    } catch (error) {
      console.error("Error registering with social media:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Phone Number</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Image
                          src="/bd-flag.png"
                          alt="Bangladesh"
                          width={20}
                          height={15}
                          className="rounded-sm"
                        />
                      </div>
                      <Input
                        placeholder="01XXXXXXXXX"
                        {...field}
                        className="bg-background pl-12"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Phone Number"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
