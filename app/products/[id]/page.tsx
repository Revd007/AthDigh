"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Loader2, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: product } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single();

        if (product) {
          setProduct(product);
          // Fetch related products
          const { data: related } = await supabase
            .from("products")
            .select("*")
            .eq("category", product.category)
            .neq("id", product.id)
            .limit(4);
          setRelatedProducts(related || []);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground">{product.description}</p>
          <Button
            size="lg"
            className="w-full"
            onClick={() => addItem({ ...product, quantity: 1 })}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <div key={related.id} className="group">
                <img
                  src={related.image_url}
                  alt={related.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <h3 className="mt-4 font-medium">{related.name}</h3>
                <p className="text-muted-foreground">
                  {formatPrice(related.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}