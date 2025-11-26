import { Link } from "wouter";
import { ChevronRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/products/ProductGrid";
import { categories, getFeaturedProducts, getProductsByCategory } from "@/data/products";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const featuredProducts = getFeaturedProducts();

  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over ₹1000" },
    { icon: Shield, title: "Secure Payment", description: "100% secure checkout" },
    { icon: RotateCcw, title: "Easy Returns", description: "30 day return policy" },
    { icon: Headphones, title: "24/7 Support", description: "Dedicated support" },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-hero-title">
                {user ? `Welcome back, ${user.firstName || 'Shopper'}!` : 'Discover Amazing Products'}
              </h1>
              <p className="text-lg text-muted-foreground mb-6" data-testid="text-hero-subtitle">
                Shop from thousands of products across 15 categories with the best deals and fast delivery.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild data-testid="button-shop-now">
                  <Link href="/category/mobile-phones">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-view-categories">
                  <Link href="#categories">View Categories</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              {categories.slice(0, 4).map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden" data-testid={`card-hero-${cat.slug}`}>
                    <div className="aspect-square relative">
                      <img 
                        src={cat.imageUrl} 
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <p className="absolute bottom-3 left-3 text-white font-medium">{cat.name}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3" data-testid={`feature-${i}`}>
                <div className="p-2 rounded-full bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" data-testid="text-categories-title">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover-elevate cursor-pointer text-center" data-testid={`link-cat-${category.slug}`}>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-muted">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-medium line-clamp-2">{category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" data-testid="text-featured-title">Featured Products</h2>
            <Button variant="ghost" asChild>
              <Link href="/category/mobile-phones" className="flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts.slice(0, 8)} columns={4} />
        </div>
      </section>

      {categories.slice(0, 4).map((category) => {
        const categoryProducts = getProductsByCategory(category.slug).slice(0, 4);
        return (
          <section key={category.id} className="py-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold" data-testid={`text-section-${category.slug}`}>{category.name}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Button variant="ghost" asChild>
                  <Link href={`/category/${category.slug}`} className="flex items-center gap-1">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <ProductGrid products={categoryProducts} columns={4} />
            </div>
          </section>
        );
      })}

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
            Get updates on new arrivals, special offers, and exclusive deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md bg-primary-foreground text-foreground"
              data-testid="input-newsletter"
            />
            <Button variant="secondary" data-testid="button-subscribe">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
