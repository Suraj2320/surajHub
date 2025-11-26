import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "support@shophub.com",
      description: "Typically responds in 24 hours",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "1800-123-4567",
      description: "Available 24/7",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Office",
      value: "ShopHub HQ, Mumbai",
      description: "Mon - Sun, 9 AM - 6 PM IST",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Live Chat",
      value: "Chat with us",
      description: "Available 24/7 on our site",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <section className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/10 py-8 md:py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-4 text-muted-foreground text-sm">
            <Link href="/">
              <span className="hover:text-foreground cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-foreground">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            We'd love to hear from you. Have a question or feedback? Reach out to our team anytime.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, idx) => (
              <Card key={idx} className="border-0 bg-gradient-to-br hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid={`contact-method-${idx}`}>
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${method.color} mb-4`}>
                    <method.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{method.title}</h3>
                  <p className="font-semibold text-sm text-primary mb-2">{method.value}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg h-full">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Fill out the form below and we'll get back to you ASAP</p>
                </CardHeader>
                <CardContent className="p-6">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mb-4 animate-bounce" />
                      <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                      <p className="text-muted-foreground">We'll get back to you within 24 hours. Check your email for updates.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Name</label>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-slate-900/50"
                            data-testid="input-contact-name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Phone</label>
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="10-digit number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-white/50 dark:bg-slate-900/50"
                            data-testid="input-contact-phone"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-2 block">Email</label>
                        <Input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-white/50 dark:bg-slate-900/50"
                          data-testid="input-contact-form-email"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-2 block">Subject</label>
                        <Input
                          type="text"
                          name="subject"
                          placeholder="How can we help?"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="bg-white/50 dark:bg-slate-900/50"
                          data-testid="input-contact-form-subject"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-2 block">Message</label>
                        <textarea
                          name="message"
                          placeholder="Tell us more..."
                          required
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          data-testid="textarea-contact-form-message"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg font-bold text-white gap-2"
                        data-testid="button-contact-form-submit"
                      >
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardContent className="p-8">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    Email Us
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">General Inquiries:</p>
                      <p className="font-semibold">support@shophub.com</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Seller Inquiries:</p>
                      <p className="font-semibold">sellers@shophub.com</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Privacy & Data:</p>
                      <p className="font-semibold">privacy@shophub.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-500/5">
                <CardContent className="p-8">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday:</span>
                      <span className="font-semibold">9 AM - 6 PM IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday - Sunday:</span>
                      <span className="font-semibold">10 AM - 4 PM IST</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Holidays:</span>
                      <span className="font-semibold">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <CardContent className="p-8">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Office Address
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">ShopHub Headquarters</p>
                    <p className="text-muted-foreground">
                      Bandra Kurla Complex<br />
                      Mumbai, Maharashtra 400051<br />
                      India
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
