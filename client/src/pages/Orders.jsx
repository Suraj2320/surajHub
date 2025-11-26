import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to view your orders",
        variant: "destructive"
      });
      window.location.href = "/api/login";
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
        <Link href="/">
          <span className="hover:text-foreground cursor-pointer">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/account">
          <span className="hover:text-foreground cursor-pointer">My Account</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Orders</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8" data-testid="text-orders-title">My Orders</h1>

      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
            <h2 className="text-xl font-semibold mb-2" data-testid="text-no-orders">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button size="lg" asChild data-testid="button-start-shopping">
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
