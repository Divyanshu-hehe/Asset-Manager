import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with the core tools. No credit card required.",
    highlight: false,
    features: [
      "1 resume analysis per month",
      "Basic roadmap generation",
      "Browse alumni directory",
      "View referral job board",
      "2 mock interview sessions",
      "Progress dashboard",
    ],
    cta: "Get Started Free",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "₹299",
    period: "month",
    description: "Everything you need to land your dream job, fast.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited resume analyses",
      "Advanced AI suggestions",
      "Unlimited roadmap generations",
      "Priority mentor matching",
      "Direct referral applications",
      "Unlimited mock interviews",
      "Detailed interview feedback",
      "Application tracking",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/signup",
  },
  {
    name: "Campus",
    price: "₹199",
    period: "student/month",
    description: "Special pricing for college students with valid .edu email.",
    highlight: false,
    badge: "Student Offer",
    features: [
      "All Pro features",
      "Verified student badge",
      "Campus leaderboards",
      "Group mentorship sessions",
      "College placement stats",
      "Dedicated campus community",
    ],
    cta: "Get Student Access",
    href: "/signup",
  },
];

const faqs = [
  { q: "Is the free plan really free?", a: "Yes. The free plan is completely free, forever. No credit card needed, no hidden fees. You can start analyzing your resume and finding mentors today." },
  { q: "Can I switch plans anytime?", a: "Yes, you can upgrade, downgrade, or cancel at any time. Changes take effect from the next billing cycle." },
  { q: "How do I verify my student status?", a: "Simply sign up with a .edu or .ac.in email address. Our system auto-detects valid student domains for campus pricing." },
  { q: "Are the mentors real people?", a: "Yes. All mentors are manually verified alumni who have agreed to mentor students on PathNexis. They are real professionals at real companies." },
  { q: "What if I'm not satisfied?", a: "We offer a 7-day full refund policy, no questions asked. If PathNexis doesn't help you, you don't pay." },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="hero-gradient pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 bg-primary/5 text-primary border-primary/20">
            <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
            Pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-4" data-testid="text-pricing-title">
            Invest in your <span className="gradient-text">career</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            PathNexis is affordable for every student. Start free — upgrade when you're ready to go all-in.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-7 flex flex-col border ${plan.highlight ? "border-primary/50 shadow-lg shadow-primary/10 relative" : "border-border bg-card"}`}
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-bg text-white border-0 shadow-md">{plan.badge}</Badge>
                  </div>
                )}
                {plan.badge && !plan.highlight && (
                  <div className="mb-1">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">{plan.badge}</Badge>
                  </div>
                )}

                <div className="mb-5">
                  <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold gradient-text" data-testid={`text-price-${plan.name.toLowerCase()}`}>{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    className={`w-full ${plan.highlight ? "gradient-bg hover:opacity-90" : ""}`}
                    variant={plan.highlight ? "default" : "outline"}
                    data-testid={`button-plan-cta-${plan.name.toLowerCase()}`}
                  >
                    {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include a 7-day money-back guarantee. No questions asked.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" data-testid="text-faq-title">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6 border-border bg-card" data-testid={`card-faq-${i}`}>
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
