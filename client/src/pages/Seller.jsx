import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package, ShoppingBag, Star, Plus } from "lucide-react";

export default function Seller() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "seller")) {
      toast({
        title: "Access Denied",
        description: "You need to be a seller to access this page",
        variant: "destructive"
      });
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading, user?.role, toast]);

  if (isLoading || !user || user.role !== "seller") {
    return <div className="text-center py-16">Loading...</div>;
  }

  const stats = [
    { icon: Package, label: "Total Products", value: "24" },
    { icon: ShoppingBag, label: "Total Orders", value: "156" },
    { icon: TrendingUp, label: "Revenue", value: "₹1.2L" },
    { icon: Star, label: "Rating", value: "4.8/5" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-seller-title">Seller Dashboard</h1>
        <p className="text-muted-foreground">Manage your products, orders, and sales</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList data-testid="tabs-seller">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="products" data-testid="tab-seller-products">Products</TabsTrigger>
          <TabsTrigger value="orders" data-testid="tab-seller-orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Dashboard Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Your sales dashboard will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Products</CardTitle>
                <Button size="sm" data-testid="button-add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Product management features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader><CardTitle>Order Fulfillment</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Order management features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader><CardTitle>Sales Analytics</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Analytics features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
