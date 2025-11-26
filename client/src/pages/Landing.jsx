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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <section className="relative bg-gradient-to-br from-primary via-primary/50 to-background py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-8 shadow-lg">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Welcome to SurajHub
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent" data-testid="text-landing-title">
                Your Ultimate<br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Shopping Destination</span>
              </h1>
              <p className="text-lg text-white/80 mb-10 max-w-lg font-medium" data-testid="text-landing-subtitle">
                Discover thousands of products across 15 categories. From electronics to fashion, 
                find everything you need with the best deals and lightning-fast delivery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 shadow-xl hover:shadow-2xl font-bold transform hover:scale-105 transition-all" asChild data-testid="button-landing-signup">
                  <Link href="/signup">Get Started Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-lg" asChild data-testid="button-landing-browse">
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
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden group border-0 bg-white/10 backdrop-blur-md hover:bg-white/20" data-testid={`card-landing-${cat.slug}`}>
                    <div className="aspect-square relative">
                      <img 
                        src={cat.imageUrl} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/60 transition-all" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold text-lg drop-shadow-lg">{cat.name}</p>
                        <p className="text-white/90 text-sm font-semibold">Explore Now →</p>
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
