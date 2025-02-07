"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Banknote, QrCode } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];
type BankAccount = Database["public"]["Tables"]["bank_accounts"]["Row"];

export function PaymentMethods({
  onSelect,
}: {
  onSelect: (methodId: string, bankAccountId?: string) => void;
}) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: methods } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("is_active", true);

      const { data: banks } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("is_active", true);

      if (methods) setPaymentMethods(methods);
      if (banks) setBankAccounts(banks);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMethod) {
      onSelect(selectedMethod, selectedBank);
    }
  }, [selectedMethod, selectedBank]);

  return (
    <div className="space-y-6">
      <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center space-x-3 space-y-3">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex items-center gap-2">
              {method.type === "bank" ? <Banknote className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
              {method.name}
            </Label>

            {method.type === "bank" && (
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="ml-4 rounded border p-2"
              >
                <option value="">Select Bank Account</option>
                {bankAccounts.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.bank_name} - {bank.account_number} ({bank.account_holder})
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
} 