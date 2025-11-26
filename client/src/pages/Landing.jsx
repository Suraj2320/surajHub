import { Link } from "wouter";
import { ChevronRight, Truck, Shield, RotateCcw, Headphones, ShoppingBag, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/products/ProductGrid";
import { categories, getFeaturedProducts } from "@/data/products";

export default function Landing() {
  const featuredProducts = getFeaturedProducts();

  const stats = [
    { icon: ShoppingBag, value: "10M+", label: "Products" },
    { icon: Users, value: "5M+", label: "Happy Customers" },
    { icon: Star, value: "4.8", label: "Average Rating" },
  ];

  const features = [
    { icon: Truck, title: "Free Shipping", description: "On orders over ₹1000" },
    { icon: Shield, title: "Secure Payment", description: "100% secure checkout" },
    { icon: RotateCcw, title: "Easy Returns", description: "30 day return policy" },
    { icon: Headphones, title: "24/7 Support", description: "Dedicated support" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-background py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Welcome to ShopHub
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="text-landing-title">
                Your Ultimate<br />
                <span className="text-primary">Shopping Destination</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg" data-testid="text-landing-subtitle">
                Discover thousands of products across 15 categories. From electronics to fashion, 
                find everything you need with the best deals and fast delivery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild data-testid="button-landing-signup">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-landing-browse">
                  <Link href="#categories">Browse Products</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 mt-10">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center" data-testid={`stat-${i}`}>
                    <div className="flex items-center justify-center gap-1">
                      <stat.icon className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-4">
              {categories.slice(0, 4).map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group" data-testid={`card-landing-${cat.slug}`}>
                    <div className="aspect-square relative">
                      <img 
                        src={cat.imageUrl} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-semibold text-lg">{cat.name}</p>
                        <p className="text-white/70 text-sm">Shop Now</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3" data-testid={`feature-landing-${i}`}>
                <div className="p-3 rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" data-testid="text-landing-categories">Shop by Category</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden" data-testid={`link-landing-cat-${category.slug}`}>
                  <div className="aspect-square relative">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-medium text-sm line-clamp-1">{category.name}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" data-testid="text-landing-featured">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked products just for you</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/category/mobile-phones" className="flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts.slice(0, 8)} columns={4} />
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto text-lg">
            Join millions of happy customers and discover amazing deals today.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-landing-cta">
            <Link href="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
