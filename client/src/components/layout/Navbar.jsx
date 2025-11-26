import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut, Package, Heart, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

export function Navbar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { getItemCount } = useCart();
  const { toast } = useToast();
  const itemCount = getItemCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onSearch?.(searchQuery.trim());
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || "U";
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/admin";
      case "seller": return "/seller";
      default: return "/account";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-background to-muted/50">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm">
                    <Link href="/">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-lg" />
                          <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-md" />
                          <div className="absolute inset-2 bg-gradient-to-br from-white/80 to-yellow-100 rounded-sm flex items-center justify-center">
                            <span className="text-xl font-black bg-gradient-to-br from-orange-600 to-red-700 bg-clip-text text-transparent">S</span>
                          </div>
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent" data-testid="link-logo-mobile">SurajHub</span>
                      </div>
                    </Link>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest px-3 mb-4">🛍️ Categories</p>
                    {categories.map((category) => (
                      <SheetClose asChild key={category.id}>
                        <Link href={`/category/${category.slug}`}>
                          <div 
                            className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:border-orange-500/30 cursor-pointer transition-all duration-200 border border-transparent backdrop-blur-sm"
                            data-testid={`link-category-mobile-${category.slug}`}
                          >
                            <span className="font-medium text-sm">{category.name}</span>
                          </div>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-white/10 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm space-y-2">
                    <p className="text-xs font-bold text-muted-foreground/70 uppercase">Quick Links</p>
                    <SheetClose asChild>
                      <Link href="/support">
                        <div className="text-sm text-muted-foreground hover:text-primary transition-colors">📞 Help Center</div>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <div className="flex items-center gap-2.5 group">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-lg group-hover:shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-300" />
                  <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-md" />
                  <div className="absolute inset-2 bg-gradient-to-br from-white/80 to-yellow-100 rounded-sm flex items-center justify-center">
                    <span className="text-2xl font-black bg-gradient-to-br from-orange-600 to-red-700 bg-clip-text text-transparent">S</span>
                  </div>
                </div>
                <span className="hidden sm:block text-xl md:text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-red-500 transition-all" data-testid="link-logo">SurajHub</span>
              </div>
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="w-full pl-10 pr-4 bg-white/5 backdrop-blur-sm border-white/20 rounded-full focus:bg-white/10 focus:border-primary/50 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setLocation("/search")} data-testid="button-search-mobile">
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/20 transition-colors" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 shadow-lg font-bold"
                    data-testid="badge-cart-count"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isLoading ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} className="object-cover" />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-sm font-medium">
                      {user.firstName || "Account"}
                    </span>
                    <ChevronDown className="h-4 w-4 hidden lg:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()}>
                      <div className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        {user.role === "admin" ? "Admin Dashboard" : user.role === "seller" ? "Seller Dashboard" : "My Account"}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <div className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-orders">
                        <Package className="h-4 w-4" />
                        My Orders
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">
                      <div className="flex items-center gap-2 w-full cursor-pointer" data-testid="link-wishlist">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button 
                      onClick={async () => {
                        await logout();
                        toast({ title: "Logged out", description: "You have been logged out successfully" });
                        setLocation("/");
                      }}
                      className="flex items-center gap-2 w-full cursor-pointer text-destructive" 
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild data-testid="button-login">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>

        <nav className="hidden md:block border-t">
          <div className="flex items-center gap-1 px-4 md:px-6 h-12 overflow-x-auto">
            {categories.slice(0, 10).map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="whitespace-nowrap text-sm"
                  data-testid={`link-category-${category.slug}`}
                >
                  {category.name}
                </Button>
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="whitespace-nowrap" data-testid="button-more-categories">
                  More <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.slice(10).map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/category/${category.slug}`}>
                      <span className="cursor-pointer" data-testid={`link-category-more-${category.slug}`}>{category.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>
  );
}
