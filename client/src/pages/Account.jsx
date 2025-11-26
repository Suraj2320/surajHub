import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { User, Package, MapPin, Heart, Settings, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to view your account",
        variant: "destructive"
      });
      window.location.href = "/api/login";
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getUserInitials = () => {
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || "U";
  };

  const menuItems = [
    { icon: Package, label: "My Orders", href: "/orders", description: "Track your orders" },
    { icon: MapPin, label: "Addresses", href: "/addresses", description: "Manage your addresses" },
    { icon: Heart, label: "Wishlist", href: "/wishlist", description: "Your saved items" },
    { icon: Settings, label: "Settings", href: "/settings", description: "Account settings" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
        <Link href="/">
          <span className="hover:text-foreground cursor-pointer">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">My Account</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} className="object-cover" />
                  <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold" data-testid="text-user-name">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground" data-testid="text-user-email">{user.email}</p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/settings">Edit Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="p-4">
              <a 
                href="/api/logout" 
                className="flex items-center gap-3 p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                data-testid="link-logout"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6" data-testid="text-account-title">My Account</h1>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No orders yet</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/">Start Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
