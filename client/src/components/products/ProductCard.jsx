import { Link } from "wouter";
import { Star, ShoppingCart, Heart } from "lucide-react";
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
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-200" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {discountPercent > 0 && (
            <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-600" data-testid={`badge-discount-${product.id}`}>
              {discountPercent}% OFF
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1" data-testid={`text-brand-${product.id}`}>
            {product.brand}
          </p>
          <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2" data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
              <span data-testid={`text-rating-${product.id}`}>{product.ratingAvg}</span>
              <Star className="h-3 w-3 fill-current" />
            </div>
            <span className="text-xs text-muted-foreground" data-testid={`text-reviews-${product.id}`}>
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold" data-testid={`text-price-${product.id}`}>
              {formatPrice(product.discountPrice)}
            </span>
            {discountPercent > 0 && (
              <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            product.stock < 10 ? (
              <p className="text-xs text-orange-600 mb-3" data-testid={`text-stock-${product.id}`}>
                Only {product.stock} left!
              </p>
            ) : (
              <p className="text-xs text-green-600 mb-3" data-testid={`text-stock-${product.id}`}>
                In Stock
              </p>
            )
          ) : (
            <p className="text-xs text-destructive mb-3" data-testid={`text-stock-${product.id}`}>
              Out of Stock
            </p>
          )}

          <Button
            className="w-full"
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
