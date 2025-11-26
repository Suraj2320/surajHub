import { Link, useLocation } from "wouter";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderSuccess() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const orderNumber = searchParams.get('order') || 'ORD000000';

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-16">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2" data-testid="text-order-success">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="text-xl font-bold" data-testid="text-order-number">{orderNumber}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild data-testid="button-view-orders">
              <Link href="/orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                View Orders
              </Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-continue-shopping">
              <Link href="/" className="flex items-center gap-2">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t text-sm text-muted-foreground">
            <p>Estimated Delivery: 3-5 Business Days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
