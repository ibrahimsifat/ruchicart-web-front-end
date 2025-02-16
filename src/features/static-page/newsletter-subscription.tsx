"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { subscribeNewsletter } from "@/lib/api/pages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export function NewsletterSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      await subscribeNewsletter(data.email);
      toast({
        title: "Success!",
        description: "You have successfully subscribed to our newsletter.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary/5 p-8 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Subscribe to Our Newsletter
      </h2>
      <p className="mb-6">Stay updated with our latest offers and news!</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          {...register("email")}
          className="flex-grow"
          error={errors.email?.message}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      {errors.email && (
        <p className="text-red-500 mt-2">{errors.email.message}</p>
      )}
    </div>
  );
}
