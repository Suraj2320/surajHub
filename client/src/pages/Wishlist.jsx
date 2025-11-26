import { Link } from "wouter";
import { ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Wishlist() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
        <Link href="/">
          <span className="hover:text-foreground cursor-pointer">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Wishlist</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8" data-testid="text-wishlist-title">My Wishlist</h1>

      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <Heart className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
            <h2 className="text-xl font-semibold mb-2" data-testid="text-empty-wishlist">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Add products to your wishlist to save them for later
            </p>
            <Button size="lg" asChild data-testid="button-start-shopping">
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
