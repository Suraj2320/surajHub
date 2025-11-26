import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";

import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Category from "@/pages/Category";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Search from "@/pages/Search";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import Account from "@/pages/Account";
import Orders from "@/pages/Orders";
import Wishlist from "@/pages/Wishlist";
import Admin from "@/pages/Admin";
import Seller from "@/pages/Seller";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={isLoading ? Home : (isAuthenticated ? Home : Landing)} />
      <Route path="/login" component={Login} />
      <Route path="/category/:slug" component={Category} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/search" component={Search} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-success" component={OrderSuccess} />
      <Route path="/account" component={Account} />
      <Route path="/orders" component={Orders} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/admin" component={Admin} />
      <Route path="/seller" component={Seller} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <AppLayout />
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
