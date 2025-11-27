import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, Package, ShoppingBag, Clock, CheckCircle, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const ORDER_STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: Package },
};

const PAYMENT_STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Paid", color: "bg-green-100 text-green-800" },
  failed: { label: "Failed", color: "bg-red-100 text-red-800" },
};

export default function Orders() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to view your orders",
        variant: "destructive"
      });
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading, error } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
    enabled: isAuthenticated && !isLoading,
  });

  if (isLoading || ordersLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="py-6">
            <p className="text-red-800">Error loading orders. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Breadcrumb */}
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-orders-title">My Orders</h1>
        <p className="text-muted-foreground">View and track all your orders</p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
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
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderStatus = ORDER_STATUS_CONFIG[order.orderStatus] || ORDER_STATUS_CONFIG.pending;
            const paymentStatus = PAYMENT_STATUS_CONFIG[order.paymentStatus] || PAYMENT_STATUS_CONFIG.pending;
            const isExpanded = expandedOrder === order.id;
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });

            return (
              <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-order-${order.id}`}>
                {/* Order Header */}
                <CardHeader 
                  className="cursor-pointer bg-gradient-to-r from-background to-muted/30 pb-4"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  data-testid={`button-expand-order-${order.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg" data-testid={`text-order-number-${order.id}`}>
                          Order #{order.orderNumber}
                        </h3>
                        <Badge className={paymentStatus.color}>
                          {paymentStatus.label}
                        </Badge>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:gap-6 text-sm text-muted-foreground">
                        <span data-testid={`text-order-date-${order.id}`}>Ordered on {formattedDate}</span>
                        <span data-testid={`text-order-total-${order.id}`}>
                          Total: ₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={orderStatus.color} data-testid={`badge-order-status-${order.id}`}>
                        {orderStatus.label}
                      </Badge>
                      <button 
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedOrder(isExpanded ? null : order.id);
                        }}
                        data-testid={`button-toggle-details-${order.id}`}
                      >
                        {isExpanded ? "Hide details" : "View details"}
                      </button>
                    </div>
                  </div>
                </CardHeader>

                {/* Order Items */}
                <CardContent className="p-4 space-y-4">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                      {/* Product Image */}
                      <div className="h-20 w-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                            data-testid={`img-product-${item.productId}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            <Package className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product?.slug}`}>
                          <h4 className="font-semibold hover:text-primary cursor-pointer line-clamp-2" data-testid={`text-product-name-${item.productId}`}>
                            {item.product?.name || "Product"}
                          </h4>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1" data-testid={`text-quantity-${item.productId}`}>
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold mt-2" data-testid={`text-price-${item.productId}`}>
                          ₹{parseFloat(item.priceAtPurchase).toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Subtotal</p>
                        <p className="font-semibold" data-testid={`text-subtotal-${item.productId}`}>
                          ₹{(parseFloat(item.priceAtPurchase) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Order Details (Expanded) */}
                {isExpanded && (
                  <div className="border-t bg-muted/20 p-4 space-y-4">
                    {/* Order Timeline */}
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Order Status Timeline</h4>
                      <div className="space-y-2">
                        {['pending', 'confirmed', 'shipped', 'delivered'].map((status, idx) => {
                          const isCompleted = ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(order.orderStatus) >= idx;
                          const statusConfig = ORDER_STATUS_CONFIG[status];
                          const IconComponent = statusConfig.icon;
                          
                          return (
                            <div key={status} className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-muted'}`}>
                                <IconComponent className={`h-4 w-4 ${isCompleted ? 'text-white' : 'text-muted-foreground'}`} />
                              </div>
                              <span className={isCompleted ? 'font-medium' : 'text-muted-foreground text-sm'}>
                                {statusConfig.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Delivery Address
                        </h4>
                        <div className="text-sm text-muted-foreground bg-background p-3 rounded">
                          <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.addressLine1}</p>
                          {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                          <p className="mt-1">📞 {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-background p-3 rounded space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{parseFloat(order.subtotal).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{parseFloat(order.shipping).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>₹{parseFloat(order.tax).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/order/${order.id}`}>Track Order</Link>
                      </Button>
                      <Button size="sm" variant="ghost">
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
