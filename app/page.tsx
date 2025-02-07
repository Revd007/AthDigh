"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GamepadIcon, SmartphoneIcon, CloudIcon, CreditCard, MonitorPlay, AppWindow } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/products/product-card";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const categoryIcons = {
  VCC: <CreditCard className="h-5 w-5" />,
  Streaming: <MonitorPlay className="h-5 w-5" />,
  Cloud: <CloudIcon className="h-5 w-5" />,
  Software: <AppWindow className="h-5 w-5" />,
  Games: <GamepadIcon className="h-5 w-5" />,
  Pulsa: <SmartphoneIcon className="h-5 w-5" />
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("VCC");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase
          .from("products")
          .select("*")
          .order("name");
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(product => product.category))];
  const filteredProducts = products.filter(product => product.category === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">AthDig Store</h1>
        
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                {categoryIcons[category as keyof typeof categoryIcons]}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  icon={categoryIcons[product.category as keyof typeof categoryIcons]}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}