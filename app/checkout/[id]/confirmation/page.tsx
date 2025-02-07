"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { Loader2, CheckCircle, Banknote, QrCode } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  created_at: string;
  items: any[];
  shipping_info: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  total_amount: number;
  status: string;
}

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("id", params.id)
          .single();

        setOrder(order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Order not found</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="bg-muted p-6 rounded-lg text-left mb-8">
          <h2 className="font-semibold mb-4">Order Details</h2>
          <div className="space-y-2">
            <p>Order ID: {order.id}</p>
            <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <p>Total: {formatPrice(order.total_amount)}</p>
          </div>

          <h3 className="font-semibold mt-6 mb-2">Shipping Information</h3>
          <div className="space-y-1">
            <p>{order.shipping_info.fullName}</p>
            <p>{order.shipping_info.address}</p>
            <p>
              {order.shipping_info.city}, {order.shipping_info.postalCode}
            </p>
            <p>{order.shipping_info.country}</p>
          </div>
        </div>

        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}