"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Loader2, CreditCard, QrCode } from "lucide-react";
import Image from "next/image";
import { PaymentMethods } from "@/components/payment/payment-methods";
import { createServerSupabaseClient } from "@/lib/server/supabase";
import { createPayment } from "@/actions/payment";
import { toast } from "@/components/ui/toast";

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'qr';
}

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [bankAccountId, setBankAccountId] = useState<string>("");

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Please sign in to complete your order");
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            items,
            shipping_info: shippingInfo,
            total_amount: total,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create payment
      const { data: payment, error } = await createPayment({
        orderId: order.id,
        paymentMethodId,
        bankAccountId,
        amount: total,
      });

      if (error) throw error;

      // Clear cart and redirect to confirmation page
      clearCart();
      router.push(`/checkout/${payment.id}/confirmation`);
    } catch (error: any) {
      toast({ title: "Payment Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                required
                value={shippingInfo.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={shippingInfo.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                required
                value={shippingInfo.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <PaymentMethods
                onSelect={(methodId, bankId) => {
                  setPaymentMethodId(methodId);
                  setBankAccountId(bankId || "");
                }}
              />
            </div>

            <Button type="submit" className="w-full mt-8" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Place Order
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <p className="font-bold">Total</p>
              <p className="font-bold">{formatPrice(total)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}