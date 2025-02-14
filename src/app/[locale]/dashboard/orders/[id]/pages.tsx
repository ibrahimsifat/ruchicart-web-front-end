"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/api";
import { ImageType } from "@/types/image";
import type { OrderItem } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  MapPin,
  Package2,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // console.log(id);
  const { data: orderDetailsData, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await api.get(`/customer/order/details?order_id=${id}`);
      return response.data as OrderItem[];
    },
  });
  console.log(orderDetailsData);
  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/customer/order/cancel`, { order_id: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      toast({
        title: "Order Canceled",
        description: "Your order has been successfully canceled.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-40 bg-muted rounded" />
              <div className="h-40 bg-muted rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-muted rounded" />
              <div className="h-40 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetailsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/dashboard/orders")}>
            View All Orders
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "processing":
      case "confirmed":
        return "bg-blue-500";
      case "canceled":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.push("/profile/orders")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      {orderDetailsData.map((orderDetails) => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <h2 className="text-2xl font-bold">
                      #{orderDetails.order.id}
                    </h2>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(orderDetails.order.order_status)}
                  >
                    {orderDetails.order.order_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(new Date(orderDetails.order.created_at), "PPP")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package2 className="h-4 w-4" />
                    {orderDetails.order.total_quantity} items
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    {orderDetails.order.order_type}
                  </div>
                </div>

                {orderDetails.order.order_status === "pending" && (
                  <div className="mt-6">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Cancel Order</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            cancel your order.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => cancelOrderMutation.mutate()}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetails.order.delivery_address.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Person</p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetails.delivery_address.contact_person_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Number</p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetails.delivery_address.contact_person_number}
                    </p>
                  </div>
                </div>

                {orderDetails.delivery_man && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={
                            orderDetails.delivery_man.image ||
                            "/placeholder.svg"
                          }
                          alt="Delivery Person"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {orderDetails.delivery_man.f_name}{" "}
                          {orderDetails.delivery_man.l_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Delivery Partner
                        </p>
                      </div>
                      <Button variant="outline" className="ml-auto">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderDetails.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                        <CustomImage
                          type={ImageType.PRODUCT}
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        {item.add_ons && item.add_ons.length > 0 && (
                          <div className="mt-1">
                            <p className="text-sm font-medium">Add-ons:</p>
                            <div className="flex flex-wrap gap-2">
                              {item.add_ons.map((addon, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {addon.name} x{addon.quantity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                        {item.add_ons && item.add_ons.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            +$
                            {item.add_ons
                              .reduce(
                                (acc, addon) =>
                                  acc + addon.price * addon.quantity,
                                0
                              )
                              .toFixed(2)}{" "}
                            add-ons
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${orderDetails.order.order_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>${orderDetails.order.delivery_charge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${orderDetails.order.total_tax_amount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">
                    $
                    {(
                      orderDetails.order.order_amount +
                      orderDetails.order.delivery_charge +
                      orderDetails.order.total_tax_amount
                    ).toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Payment Method
                    </span>
                    <span className="font-medium">
                      {orderDetails.order.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Payment Status
                    </span>
                    <Badge
                      variant={
                        orderDetails.order.payment_status === "paid"
                          ? "success"
                          : "warning"
                      }
                    >
                      {orderDetails.order.payment_status}
                    </Badge>
                  </div>
                </div>

                {orderDetails.order.order_status === "pending" && (
                  <>
                    <Separator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          Cancel Order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            cancel your order.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => cancelOrderMutation.mutate()}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
