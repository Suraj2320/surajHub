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
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Link href="/">
                      <span className="text-2xl font-bold text-primary" data-testid="link-logo-mobile">ShopHub</span>
                    </Link>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-4">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Categories</p>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <SheetClose asChild key={category.id}>
                          <Link href={`/category/${category.slug}`}>
                            <div 
                              className="block px-3 py-2 rounded-md hover-elevate cursor-pointer"
                              data-testid={`link-category-mobile-${category.slug}`}
                            >
                              {category.name}
                            </div>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent" data-testid="link-logo">ShopHub</span>
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
