import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started instantly — no account needed.",
    features: [
      "5 transcripts per day",
      "Executive summaries",
      "Basic mind maps",
      "Standard processing speed",
    ],
    cta: "Current Plan",
    disabled: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For power users who need more depth.",
    features: [
      "Unlimited transcripts",
      "All summary formats",
      "Advanced mind maps & flow charts",
      "Priority processing",
      "Export to PDF & Markdown",
      "API access",
    ],
    cta: "Upgrade with Razorpay",
    disabled: false,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "per month",
    description: "For teams and organizations at scale.",
    features: [
      "Everything in Pro",
      "Team workspace",
      "Custom AI models",
      "SSO & advanced security",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Upgrade with Razorpay",
    disabled: false,
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Start free, upgrade when you're ready. No surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col ${tier.highlight ? "border-primary ring-2 ring-primary/20 shadow-lg" : ""}`}
            >
              <CardHeader>
                {tier.highlight && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary mb-2">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </div>
                )}
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">/{tier.period}</span>
                </div>
                <ul className="space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.highlight ? "default" : "outline"}
                  disabled={tier.disabled}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;
