import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Cart() {
  const [, navigate] = useLocation();
  const { items, updateQuantity, removeFromCart, getSubtotal, getTax, getShipping, getTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-bold mb-4" data-testid="text-empty-cart">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button size="lg" asChild data-testid="button-start-shopping">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
        <Link href="/">
          <span className="hover:text-foreground cursor-pointer">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Shopping Cart</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8" data-testid="text-cart-title">
        Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id} data-testid={`card-cart-item-${item.product.id}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Link href={`/product/${item.product.slug}`}>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="font-medium hover:text-primary line-clamp-2" data-testid={`text-item-name-${item.product.id}`}>
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2" data-testid={`text-item-brand-${item.product.id}`}>
                      {item.product.brand}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold" data-testid={`text-item-price-${item.product.id}`}>
                        {formatPrice(item.product.discountPrice)}
                      </span>
                      {item.product.price > item.product.discountPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.product.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.product.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm" data-testid={`text-quantity-${item.product.id}`}>
                          {item.quantity}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          data-testid={`button-increase-${item.product.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="ghost" asChild className="mt-4">
            <Link href="/" className="flex items-center gap-2" data-testid="link-continue-shopping">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span data-testid="text-subtotal">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span data-testid="text-shipping">
                  {getShipping() === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatPrice(getShipping())
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (18% GST)</span>
                <span data-testid="text-tax">{formatPrice(getTax())}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span data-testid="text-total">{formatPrice(getTotal())}</span>
              </div>
              
              {getSubtotal() < 1000 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(1000 - getSubtotal())} more for free shipping
                </p>
              )}

              {isAuthenticated ? (
                <Button className="w-full" size="lg" asChild data-testid="button-checkout">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={() => navigate("/login")} data-testid="button-login-checkout">
                  Login to Checkout
                </Button>
              )}

              <div className="text-center text-xs text-muted-foreground">
                Secure checkout powered by Stripe
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
