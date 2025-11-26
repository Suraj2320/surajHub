import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, CreditCard, Check, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getSubtotal, getTax, getShipping, getTotal, clearCart } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("new");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to proceed with checkout",
        variant: "destructive"
      });
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      setLocation("/cart");
    }
  }, [items, setLocation, isProcessing]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    const required = ["fullName", "phone", "addressLine1", "city", "state", "postalCode"];
    for (const field of required) {
      if (!address[field]?.trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive"
        });
        return false;
      }
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return false;
    }
    if (!/^\d{6}$/.test(address.postalCode)) {
      toast({
        title: "Invalid Postal Code",
        description: "Please enter a valid 6-digit postal code",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateAddress()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderNumber = `ORD${Date.now()}`;
    
    toast({
      title: "Order Placed Successfully!",
      description: `Your order ${orderNumber} has been placed.`,
    });
    
    clearCart();
    setLocation(`/order-success?order=${orderNumber}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
        <Link href="/">
          <span className="hover:text-foreground cursor-pointer">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/cart">
          <span className="hover:text-foreground cursor-pointer">Cart</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Checkout</span>
      </nav>

      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {step > 1 ? <Check className="h-4 w-4" /> : 1}
          </div>
          <span className="hidden sm:inline font-medium">Address</span>
        </div>
        <div className="w-12 h-0.5 bg-muted" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {step > 2 ? <Check className="h-4 w-4" /> : 2}
          </div>
          <span className="hidden sm:inline font-medium">Payment</span>
        </div>
        <div className="w-12 h-0.5 bg-muted" />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            3
          </div>
          <span className="hidden sm:inline font-medium">Confirm</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      placeholder="John Doe"
                      data-testid="input-full-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      placeholder="9876543210"
                      maxLength={10}
                      data-testid="input-phone"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="House/Flat No., Building Name"
                    data-testid="input-address1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Street, Locality (Optional)"
                    data-testid="input-address2"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      placeholder="Mumbai"
                      data-testid="input-city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      placeholder="Maharashtra"
                      data-testid="input-state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      placeholder="400001"
                      maxLength={6}
                      data-testid="input-postal"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  size="lg" 
                  onClick={handleContinueToPayment}
                  data-testid="button-continue-payment"
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Shipping to:</p>
                  <p className="text-sm text-muted-foreground">
                    {address.fullName}<br />
                    {address.addressLine1}<br />
                    {address.addressLine2 && <>{address.addressLine2}<br /></>}
                    {address.city}, {address.state} - {address.postalCode}<br />
                    Phone: {address.phone}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setStep(1)}
                  >
                    Change Address
                  </Button>
                </div>

                <RadioGroup defaultValue="card" className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover-elevate">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Credit/Debit Card</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Pay securely with Stripe</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover-elevate">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <span>UPI Payment</span>
                      <p className="text-sm text-muted-foreground mt-1">Pay using any UPI app</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover-elevate">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <span>Cash on Delivery</span>
                      <p className="text-sm text-muted-foreground mt-1">Pay when you receive</p>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    data-testid="button-back-address"
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    size="lg" 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    data-testid="button-place-order"
                  >
                    {isProcessing ? "Processing..." : `Pay ${formatPrice(getTotal())}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatPrice(item.product.discountPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{getShipping() === 0 ? <span className="text-green-600">FREE</span> : formatPrice(getShipping())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>{formatPrice(getTax())}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span data-testid="text-checkout-total">{formatPrice(getTotal())}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
