"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/api";
import { getQueryClient, queryKeys } from "@/lib/api/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const reviewSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
  rating: z.number().min(1).max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ProductReviewProps {
  productId: number;
  orderId: number;
  onReviewSubmitted: () => void;
}

export function ProductReview({
  productId,
  orderId,
  onReviewSubmitted,
}: ProductReviewProps) {
  const [rating, setRating] = useState(0);
  const { toast } = useToast();
  const queryClient = getQueryClient();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const submitReview = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const formData = new FormData();
      formData.append("product_id", productId.toString());
      formData.append("order_id", orderId.toString());
      formData.append("comment", data.comment);
      formData.append("rating", data.rating.toString());

      const response = await api.post("/products/reviews/submit", formData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.details(orderId.toString()),
      });
      onReviewSubmitted();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    submitReview.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => {
                        setRating(star);
                        field.onChange(star);
                      }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your review here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitReview.isPending}>
          {submitReview.isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
}
