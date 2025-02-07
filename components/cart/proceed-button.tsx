"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";

export function ProceedToCheckout() {
  const router = useRouter();
  const { items } = useCartStore((state) => ({ items: state.items }));

  const handleCheckout = () => {
    if (items.length === 0) {
      return; // Disable button if cart is empty
    }
    router.push("/checkout");
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={items.length === 0}
      className="w-full mt-4"
      aria-label="Proceed to checkout"
    >
      Proceed to Checkout ({items.length})
    </Button>
  );
} 