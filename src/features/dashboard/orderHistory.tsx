"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/lib/hooks/queries/order/useOrders";
import { ImageType } from "@/types/image";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function OrderHistory() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { data, isLoading, error } = useOrders({ limit: 10, page: 1 });
  const { orders } = data || {};
  const t = useTranslations("dashboard");
  if (orders?.length === 0) return <div>{t("noOrdersFound")}</div>;
  const toggleOrderDetails = (orderId: any) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: any) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "confirmed":
        return "bg-blue-500";
      case "processing":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) return <div>{t("loadingOrders")}</div>;
  if (error) return <div>{t("errorLoadingOrders")}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("orderHistory")}</CardTitle>
      </CardHeader>
      <CardContent>
        {orders?.length === 0 ? (
          <p>{t("noOrdersFound")}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("orderId")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("total")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order: any) => (
                <>
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), "PPP")}
                    </TableCell>
                    <TableCell>${order.order_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.order_status)}>
                        {order.order_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedOrder === order.id && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="p-4 bg-gray-50">
                          <h4 className="font-semibold mb-2">
                            {t("orderDetails")}
                          </h4>
                          <ul className="space-y-2">
                            <div className="space-y-4">
                              <div className="mt-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <h4 className="font-semibold">
                                      {t("orderType")}
                                    </h4>
                                    <p>{order.order_type}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">
                                      {t("paymentStatus")}
                                    </h4>
                                    <p>{order.payment_status}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">
                                      {t("deliveryAddressId")}
                                    </h4>
                                    <p>{order.delivery_address_id}</p>
                                  </div>
                                </div>
                                <h4 className="font-semibold mb-2">
                                  {t("productImages")}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {order.product_images.map((image, index) => (
                                    <CustomImage
                                      key={index}
                                      src={image}
                                      type={ImageType.PRODUCT}
                                      alt={`Product ${index + 1}`}
                                      width={100}
                                      height={100}
                                      className="rounded-md"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </ul>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
