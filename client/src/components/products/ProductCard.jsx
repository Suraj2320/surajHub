import { Link } from "wouter";
import { Star, ShoppingCart, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  
  const discountPercent = product.price > product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-background to-muted/50" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-900/5 to-slate-900/10">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 group-hover:brightness-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {discountPercent > 0 && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg text-white border-0 gap-1" data-testid={`badge-discount-${product.id}`}>
              <Zap className="h-3 w-3 fill-current" />
              {discountPercent}% OFF
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className="h-5 w-5 text-red-500 hover:fill-red-500" />
          </Button>
        </div>
        
        <CardContent className="p-4 bg-gradient-to-b from-transparent to-muted/30">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1.5 opacity-70" data-testid={`text-brand-${product.id}`}>
            {product.brand}
          </p>
          <h3 className="text-sm font-bold line-clamp-2 h-10 mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent" data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full shadow-md font-semibold">
              <Star className="h-3 w-3 fill-current" />
              <span data-testid={`text-rating-${product.id}`}>{product.ratingAvg}</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium" data-testid={`text-reviews-${product.id}`}>
              {product.reviewCount.toLocaleString()} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-black bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent" data-testid={`text-price-${product.id}`}>
              {formatPrice(product.discountPrice)}
            </span>
            {discountPercent > 0 && (
              <span className="text-sm text-muted-foreground/60 line-through font-semibold" data-testid={`text-original-price-${product.id}`}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            product.stock < 10 ? (
              <p className="text-xs font-bold text-orange-600 mb-3 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-full inline-block" data-testid={`text-stock-${product.id}`}>
                ⚡ Only {product.stock} left!
              </p>
            ) : (
              <p className="text-xs font-bold text-emerald-600 mb-3 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full inline-block" data-testid={`text-stock-${product.id}`}>
                ✓ In Stock
              </p>
            )
          ) : (
            <p className="text-xs font-bold text-destructive mb-3 bg-destructive/10 px-2 py-1 rounded-full inline-block" data-testid={`text-stock-${product.id}`}>
              Out of Stock
            </p>
          )}

          <Button
            className="w-full mt-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isInCart(product.id)}
            data-testid={`button-add-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart(product.id) ? "In Cart" : "Add to Cart"}
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}
