"use server";

import { createServerSupabaseClient } from "@/lib/server/supabase";
import type { Database } from "@/types/supabase";

export const createPayment = async (paymentData: {
  orderId: string;
  paymentMethodId: string;
  bankAccountId?: string;
  amount: number;
}) => {
  const supabase = createServerSupabaseClient();

  return (await supabase)
    .from("payments")
    .insert([{
      order_id: paymentData.orderId,
      payment_method_id: paymentData.paymentMethodId,
      bank_account_id: paymentData.bankAccountId,
      amount: paymentData.amount,
      status: "pending",
      expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    }])
    .select()
    .single();
}; 