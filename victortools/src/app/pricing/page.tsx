"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for occasional use",
    features: [
      "20 uses per day",
      "Up to 10MB file size",
      "All basic tools",
      "Client-side processing",
      "No watermark on images",
      "Watermark on PDF outputs",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹99",
    period: "/month",
    description: "For power users and professionals",
    features: [
      "Unlimited daily usage",
      "Up to 100MB file size",
      "All tools included",
      "No watermarks",
      "Batch processing",
      "Priority processing queue",
      "API access (coming soon)",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free, upgrade when you need more. No hidden fees.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? "border-brand shadow-lg shadow-brand/10 relative" : ""}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 text-brand shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Payment processing via Razorpay (UPI, Cards, Netbanking) and Stripe (International cards).
        </p>
        <p className="mt-1">All payments are secure and encrypted.</p>
      </div>
    </div>
  );
}
