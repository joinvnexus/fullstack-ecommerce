"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  CreditCard,
  Truck,
  Shield,
  Lock,
  Loader2,
  Smartphone,
  Check,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

import useCartStore from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { ordersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, ProductImage } from "@/types";

// Payment components
import StripeCheckout from "../components/payments/StripeCheckout";
import BkashCheckout from "../components/payments/BkashCheckout";
import NagadCheckout from "../components/payments/NagadCheckout";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const checkoutSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
  }),
  shippingMethod: z.object({
    name: z.string(),
    cost: z.number(),
    estimatedDays: z.number(),
  }),
  paymentMethod: z.enum(["stripe", "bkash", "nagad"]),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type CheckoutStep = "shipping" | "payment" | "review";

const shippingMethods = [
  { name: "Standard Shipping", cost: 0, estimatedDays: 7, description: "Free delivery within 7 business days" },
  { name: "Express Shipping", cost: 10, estimatedDays: 2, description: "Fast delivery within 2 business days" },
];

// Helper function to get product name
const getProductName = (product: Product | string | undefined): string => {
  if (!product) return "Unknown Product";
  if (typeof product === "string") return "Product";
  return product.title || "Unknown Product";
};

// Helper function to get product image
const getProductImage = (product: Product | string | undefined): string | null => {
  if (!product || typeof product === "string") return null;
  const images = product.images as ProductImage[];
  if (images && images.length > 0 && images[0]?.url) {
    return images[0].url;
  }
  return null;
};

// Helper function to check if image URL is valid
const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== "string") return false;
  return url.trim().length > 0 && (url.startsWith("http") || url.startsWith("/"));
};

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, isLoading: cartLoading, clearCart } = useCartStore();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<"order" | "payment">("order");
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    shipping: true,
    payment: true,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "stripe",
      shippingMethod: shippingMethods[0],
      shippingAddress: {
        email: user?.email || "",
        phone: "",
        street: "",
        city: "",
        state: "",
        country: "Bangladesh",
        zipCode: "",
      },
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");
  const selectedShippingMethod = watch("shippingMethod");

  const subtotal = cart?.subtotal || 0;
  const shippingCost = selectedShippingMethod.cost;
  const tax = subtotal * 0.1;
  const totalAmount = subtotal + shippingCost + tax;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);

      const res = await ordersApi.create({
        shippingAddress: data.shippingAddress,
        shippingMethod: data.shippingMethod,
        notes: data.notes,
      });

      setCreatedOrder(res.data);
      setPaymentStep("payment");
    } catch (err: any) {
      console.error("Order creation error:", err);
      alert(`Order creation failed: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push("/checkout/success");
  };

  // Empty cart state
  if (!cartLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to your cart to proceed with checkout.</p>
            <Button
              onClick={() => router.push("/products")}
              className="w-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment step
  if (paymentStep === "payment" && createdOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Secure Payment
              </CardTitle>
              <p className="text-blue-100 text-sm">Order #{createdOrder.orderNumber}</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Amount to pay</span>
                  <span className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4 text-green-500" />
                  Secure payment powered by {selectedPaymentMethod === "stripe" ? "Stripe" : selectedPaymentMethod === "bkash" ? "bKash" : "Nagad"}
                </div>
              </div>

              {selectedPaymentMethod === "stripe" && (
                <Elements stripe={stripePromise}>
                  <StripeCheckout
                    orderId={createdOrder._id}
                    amount={totalAmount}
                    onSuccess={handlePaymentSuccess}
                    onError={(error: string) => alert(error)}
                  />
                </Elements>
              )}

              {selectedPaymentMethod === "bkash" && (
                <BkashCheckout
                  orderId={createdOrder._id}
                  amount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={(error: string) => alert(error)}
                />
              )}

              {selectedPaymentMethod === "nagad" && (
                <NagadCheckout
                  orderId={createdOrder._id}
                  amount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={(error: string) => alert(error)}
                />
              )}

              <Button
                variant="outline"
                onClick={() => setPaymentStep("order")}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Lock className="w-4 h-4 text-green-500" />
          <span>Secure checkout</span>
          <span className="mx-2">•</span>
          <span>SSL encrypted</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          {(["shipping", "payment", "review"] as CheckoutStep[]).map((step, index) => {
            const steps: CheckoutStep[] = ["shipping", "payment", "review"];
            const currentIndex = steps.indexOf(currentStep);
            const isActive = step === currentStep;
            const isCompleted = steps.indexOf(step) < currentIndex;
            
            return (
              <div key={step} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (steps.indexOf(step) < currentIndex) {
                      setCurrentStep(step);
                    }
                  }}
                  className={`flex items-center gap-2 ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                    isCompleted ? "bg-green-500 text-white" :
                    isActive ? "bg-blue-600 text-white" :
                    "bg-gray-200 text-gray-500"
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className="hidden sm:inline font-medium capitalize">{step}</span>
                </button>
                {index < 2 && (
                  <div className={`w-12 sm:w-24 h-1 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <Card>
              <CardHeader>
                <button
                  type="button"
                  onClick={() => toggleSection("shipping")}
                  className="flex items-center justify-between w-full"
                >
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    Shipping Address
                  </CardTitle>
                  {expandedSections.shipping ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </CardHeader>
              {expandedSections.shipping && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("shippingAddress.email")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.shippingAddress?.email ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.shippingAddress?.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingAddress.email.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register("shippingAddress.phone")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.shippingAddress?.phone ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="+880 1XXXXXXXXX"
                      />
                      {errors.shippingAddress?.phone && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingAddress.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        {...register("shippingAddress.street")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.shippingAddress?.street ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="123 Main Street, Apartment, Building"
                      />
                      {errors.shippingAddress?.street && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingAddress.street.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        {...register("shippingAddress.city")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.shippingAddress?.city ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="Dhaka"
                      />
                      {errors.shippingAddress?.city && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingAddress.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Division *</label>
                      <input
                        type="text"
                        {...register("shippingAddress.state")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.shippingAddress?.state ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="Dhaka"
                      />
                      {errors.shippingAddress?.state && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingAddress.state.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                      <input
                        type="text"
                        {...register("shippingAddress.country")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.shippingAddress?.country ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="Bangladesh"
                      />
                      {errors.shippingAddress?.country && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingAddress.country.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                      <input
                        type="text"
                        {...register("shippingAddress.zipCode")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.shippingAddress?.zipCode ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                        placeholder="1200"
                      />
                      {errors.shippingAddress?.zipCode && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.shippingAddress.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  Shipping Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shippingMethods.map((method, index) => (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedShippingMethod.name === method.name
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value={JSON.stringify(method)}
                          {...register("shippingMethod", {
                            setValueAs: (value) => JSON.parse(value),
                          })}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          defaultChecked={index === 0}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-900">{method.name}</span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-4 h-4" />
                            {method.description}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {method.cost === 0 ? "Free" : `$${method.cost.toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Stripe */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "stripe"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="stripe"
                        {...register("paymentMethod")}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-7 bg-indigo-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Stripe</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Credit/Debit Card</span>
                          <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                        </div>
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </label>

                  {/* bKash */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "bkash"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="bkash"
                        {...register("paymentMethod")}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-7 bg-pink-500 rounded flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">bKash</span>
                          <p className="text-sm text-gray-500">Mobile financial service</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-pink-500 font-bold">bKash</span>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === "nagad"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="nagad"
                        {...register("paymentMethod")}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-7 bg-orange-500 rounded flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Nagad</span>
                          <p className="text-sm text-gray-500">Digital financial service</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-orange-500 font-bold">Nagad</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Add any special instructions for your order..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Cart Items */}
                <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                  {cart?.items.map((item: any) => {
                    const productName = getProductName(item.productId);
                    const productImage = getProductImage(item.productId);
                    const itemPrice = item.unitPrice || item.price || 0;
                    
                    return (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {productImage ? (
                            <Image
                              src={productImage}
                              alt={productName}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-gray-400 ${productImage ? "hidden" : ""}`}>
                            <Package className="w-8 h-8" />
                          </div>
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{productName}</p>
                          {item.variantId && (
                            <p className="text-sm text-gray-500">{item.variantId.name || "Variant"}</p>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span className={shippingCost === 0 ? "text-green-600" : ""}>
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      ${totalAmount.toFixed(2)} - Pay Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Protected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
