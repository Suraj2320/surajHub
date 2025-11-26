import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, Search, Mail, Phone, MessageSquare, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const faqItems = [
    {
      category: "Orders & Shipping",
      items: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery. Free shipping is available on orders over ₹1000."
        },
        {
          q: "Can I track my order?",
          a: "Yes! You can track your order in real-time from your account under 'My Orders'. We send you email notifications at each stage of delivery."
        },
        {
          q: "What's your return policy?",
          a: "We offer a 30-day return policy on most items. Products must be unused and in original packaging. Returns are free for defective items."
        }
      ]
    },
    {
      category: "Payments & Security",
      items: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit/debit cards, UPI, digital wallets (Google Pay, PhonePe, Paytm), and net banking. All payments are encrypted with SSL 256-bit security."
        },
        {
          q: "Is my payment information safe?",
          a: "Absolutely! We use industry-leading Stripe encryption and never store complete card details. Your data is PCI-DSS compliant."
        },
        {
          q: "Do you offer EMI options?",
          a: "Yes, select items qualify for 3, 6, or 12-month EMI options at 0% interest through partner banks."
        }
      ]
    },
    {
      category: "Account & Login",
      items: [
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the login page and follow the email verification process. You'll receive a reset link within 5 minutes."
        },
        {
          q: "Can I have multiple accounts?",
          a: "Yes, but we recommend using one account per email. Multiple accounts on the same email may affect your loyalty rewards."
        },
        {
          q: "How do I delete my account?",
          a: "Go to Account Settings > Privacy Settings > Delete Account. Note: All order history will be retained for legal compliance."
        }
      ]
    },
    {
      category: "Products & Quality",
      items: [
        {
          q: "Are all products authentic?",
          a: "Yes! We guarantee 100% authentic products. All sellers are verified. If you receive a counterfeit product, we offer full refund + additional compensation."
        },
        {
          q: "What if the product is damaged?",
          a: "Contact support immediately with photos. We'll replace or refund within 24 hours, completely free."
        },
        {
          q: "Do you have a warranty?",
          a: "Manufacturer warranty applies to all products. Electronics typically have 1-2 year warranty. Check product details for specifics."
        }
      ]
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setMessage("");
      setSubmitted(false);
    }, 3000);
  };

  const filteredFAQ = searchQuery.trim() ? faqItems.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0) : faqItems;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <section className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/10 py-12 md:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Find answers to common questions and get help whenever you need it. We're here to support you 24/7.
          </p>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-12 h-12 bg-white/80 dark:bg-slate-900/50 border-white/30 rounded-lg focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-support-search"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Link href="/contact">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-lg mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">Contact us via email</p>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center justify-center gap-1">
                    Get Support <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="p-8 text-center">
                <Phone className="h-12 w-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-4">24/7 Customer Support</p>
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">1800-123-4567</span>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">Chat with our team</p>
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm flex items-center justify-center gap-1">
                  Start Chat <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-3xl font-bold mb-8" data-testid="text-faq-title">Frequently Asked Questions</h2>

          {filteredFAQ.length === 0 ? (
            <Card className="border-0 bg-muted/50">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground mt-2">Try different keywords or contact support</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {filteredFAQ.map((category) => (
                <div key={category.category}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                    {category.category}
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.items.map((item, idx) => (
                      <AccordionItem 
                        key={`${category.category}-${idx}`} 
                        value={`${category.category}-${idx}`}
                        className="border border-white/10 rounded-lg px-4 bg-card/50 data-[state=open]:bg-card data-[state=open]:border-primary/50 transition-all"
                        data-testid={`faq-item-${idx}`}
                      >
                        <AccordionTrigger className="hover:text-primary transition-colors font-semibold">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Still need help? Contact us</h2>
          
          {submitted ? (
            <Card className="border-0 bg-green-50 dark:bg-green-950/30 text-center p-8">
              <p className="text-green-700 dark:text-green-400 font-semibold mb-2">Message Sent Successfully!</p>
              <p className="text-green-600 dark:text-green-500 text-sm">We'll get back to you within 24 hours.</p>
            </Card>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/50 dark:bg-slate-900/50"
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Subject</label>
                  <Input
                    placeholder="How can we help?"
                    className="bg-white/50 dark:bg-slate-900/50"
                    data-testid="input-contact-subject"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Message</label>
                <textarea
                  placeholder="Describe your issue in detail..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  data-testid="textarea-contact-message"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg font-bold text-white" data-testid="button-contact-submit">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
