import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Shield, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
  };
  icon?: React.ReactNode;
}

export function ProductCard({ product, icon }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Extract features and warranty info from description
  const features = product.description
    .split('\n')
    .filter(line => line.trim().startsWith('✅'))
    .map(line => line.replace('✅', '').trim());

  const details = product.description
    .split('\n')
    .filter(line => line.trim().startsWith('*'))
    .map(line => line.replace('*', '').trim());

  // Determine if product has warranty
  const hasWarranty = product.description.toLowerCase().includes('garansi');
  
  // Extract duration if available
  const durationMatch = product.name.match(/\d+\s*(day|week|month|year|bulan|tahun|hari)/i);
  const duration = durationMatch ? durationMatch[0] : null;

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setShowDetails(true)}
      >
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="flex items-center gap-2">
              {icon}
              {product.name}
            </CardTitle>
          </div>
          {duration && (
            <Badge variant="secondary" className="w-fit">
              <Clock className="w-3 h-3 mr-1" />
              {duration}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold mb-2">{formatPrice(product.price)}</p>
          <div className="mb-4">
            {features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                {feature}
              </div>
            ))}
            {features.length > 2 && (
              <p className="text-sm text-muted-foreground mt-1">
                +{features.length - 2} more features
              </p>
            )}
          </div>
          <Button 
            className="w-full group-hover:bg-primary/90" 
            onClick={(e) => {
              e.stopPropagation();
              addItem({ ...product, quantity: 1 });
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {icon}
                {product.name}
              </DialogTitle>
              {hasWarranty && (
                <Badge variant="secondary" className="flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Warranty
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Price</h3>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                {duration && (
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {duration}
                  </Badge>
                )}
              </div>
            </div>

            {details.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                  {details.map((detail, index) => (
                    <p key={index} className="text-sm">{detail}</p>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                    <p className="text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                addItem({ ...product, quantity: 1 });
                setShowDetails(false);
              }}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}