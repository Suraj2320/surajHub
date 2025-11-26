import { useState } from "react";
import { useParams, Link } from "wouter";
import { ChevronRight, Star, Minus, Plus, ShoppingCart, Heart, Truck, RotateCcw, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useCart } from "@/context/CartContext";
import { getProductBySlug, getProductsByCategory, getCategoryBySlug } from "@/data/products";

export default function ProductDetail() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  const category = getCategoryBySlug(product.categorySlug);
  const relatedProducts = getProductsByCategory(product.categorySlug)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

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

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap" data-testid="breadcrumb">
        <Link href="/">
          <span className="hover:text-foreground cursor-pointer">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/category/${product.categorySlug}`}>
          <span className="hover:text-foreground cursor-pointer">{category?.name}</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="img-product-main"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
                data-testid={`button-thumbnail-${index}`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2" data-testid="text-product-brand">
            {product.brand}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-4" data-testid="text-product-name">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-green-600 text-white text-sm px-2 py-1 rounded">
              <span data-testid="text-product-rating">{product.ratingAvg}</span>
              <Star className="h-4 w-4 fill-current" />
            </div>
            <span className="text-muted-foreground" data-testid="text-product-reviews">
              {product.reviewCount.toLocaleString()} Reviews
            </span>
          </div>

          <Separator className="my-4" />

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold" data-testid="text-product-price">
              {formatPrice(product.discountPrice)}
            </span>
            {discountPercent > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through" data-testid="text-product-original-price">
                  {formatPrice(product.price)}
                </span>
                <Badge className="bg-green-600 hover:bg-green-600" data-testid="badge-product-discount">
                  {discountPercent}% OFF
                </Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground mb-6" data-testid="text-product-description">
            {product.description}
          </p>

          {product.stock > 0 ? (
            product.stock < 10 ? (
              <p className="text-orange-600 font-medium mb-4" data-testid="text-product-stock">
                Only {product.stock} left in stock - order soon!
              </p>
            ) : (
              <p className="text-green-600 font-medium flex items-center gap-1 mb-4" data-testid="text-product-stock">
                <Check className="h-4 w-4" /> In Stock
              </p>
            )
          ) : (
            <p className="text-destructive font-medium mb-4" data-testid="text-product-stock">
              Out of Stock
            </p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                data-testid="button-quantity-minus"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium" data-testid="text-quantity">
                {quantity}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                data-testid="button-quantity-plus"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isInCart(product.id)}
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isInCart(product.id) ? "Already in Cart" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline" data-testid="button-add-wishlist">
              <Heart className="h-5 w-5 mr-2" />
              Wishlist
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-xs">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-xs">30 Day Returns</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="specifications" data-testid="tab-specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="specifications" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b" data-testid={`spec-${key.toLowerCase().replace(/\s+/g, '-')}`}>
                <span className="text-muted-foreground">{key}</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm">Be the first to review this product</p>
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6" data-testid="text-related-products">Related Products</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}
