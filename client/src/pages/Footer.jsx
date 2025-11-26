import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Shop": [
      { label: "Electronics", href: "/category/electronics" },
      { label: "Fashion", href: "/category/fashion" },
      { label: "Home & Kitchen", href: "/category/home-kitchen" },
      { label: "Best Sellers", href: "/?sort=bestsellers" }
    ],
    "About": [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" }
    ],
    "Support": [
      { label: "Help Center", href: "/support" },
      { label: "Contact Us", href: "/contact" },
      { label: "Track Order", href: "/orders" },
      { label: "FAQ", href: "/support#faq" }
    ],
    "Legal": [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Return Policy", href: "/returns" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/">
              <h3 className="text-2xl font-black bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent mb-2">
                SurajHub
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Your ultimate shopping destination for everything you need, delivered fast.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-muted/50 hover:bg-primary/20 transition-colors text-muted-foreground hover:text-primary"
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-lg mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* Contact & Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex gap-3" data-testid="footer-contact-email">
            <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Email</p>
              <a href="mailto:support@shophub.com" className="text-sm text-muted-foreground hover:text-primary">
                support@shophub.com
              </a>
            </div>
          </div>

          <div className="flex gap-3" data-testid="footer-contact-phone">
            <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Phone</p>
              <a href="tel:1800-123-4567" className="text-sm text-muted-foreground hover:text-primary">
                1800-123-4567
              </a>
            </div>
          </div>

          <div className="flex gap-3" data-testid="footer-contact-address">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Address</p>
              <p className="text-sm text-muted-foreground">
                Bandra Kurla Complex, Mumbai
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} SurajHub. All rights reserved. | Made with ❤️ in India
          </p>
          
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>•</span>
            <span>100% Authentic Products</span>
            <span>•</span>
            <span>Secure Payments</span>
            <span>•</span>
            <span>Free Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
