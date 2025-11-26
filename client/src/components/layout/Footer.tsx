import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ShopHub</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your one-stop destination for all your shopping needs. Quality products at the best prices.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-full bg-muted hover-elevate" data-testid="link-facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover-elevate" data-testid="link-twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover-elevate" data-testid="link-instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover-elevate" data-testid="link-youtube">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-about">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-contact">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-careers">Careers</span>
                </Link>
              </li>
              <li>
                <Link href="/become-seller">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-become-seller">Become a Seller</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-help">Help Center</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-shipping">Shipping Info</span>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-returns">Returns & Refunds</span>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-faq">FAQs</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  123 Commerce Street, Tech Park,<br />
                  Bangalore, Karnataka 560001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">support@shophub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy">
              <span className="hover:text-foreground cursor-pointer" data-testid="link-privacy">Privacy Policy</span>
            </Link>
            <Link href="/terms">
              <span className="hover:text-foreground cursor-pointer" data-testid="link-terms">Terms of Service</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
