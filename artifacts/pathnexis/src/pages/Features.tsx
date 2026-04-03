import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, Users, Briefcase, Mic, TrendingUp, CheckCircle, ArrowRight, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: Brain,
    title: "AI Resume Analyzer",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    description: "Upload your resume and get a comprehensive AI-powered analysis in seconds. Our system evaluates keyword optimization, ATS compatibility, formatting, and content quality.",
    benefits: ["Instant score out of 100", "ATS keyword gap analysis", "Role-specific suggestions", "Skill gap identification", "Before/after comparison"],
    href: "/resume",
    cta: "Analyze Resume",
  },
  {
    icon: BookOpen,
    title: "Personalized Roadmap",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    description: "Tell us your target role and current skills. Our AI generates a step-by-step learning roadmap with curated resources, estimated timelines, and progress tracking.",
    benefits: ["Role-specific learning paths", "Skill gap identification", "Progress checkboxes", "Resource recommendations", "Category-based organization"],
    href: "/roadmap",
    cta: "Generate Roadmap",
  },
  {
    icon: Users,
    title: "Alumni Mentor Network",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    description: "Connect with alumni from Tier 3/4 colleges who made it to top companies. Get real guidance from people who understand your specific challenges and background.",
    benefits: ["500+ verified mentors", "Filter by company & role", "Direct connection requests", "From Tier 3/4 colleges", "Real career stories"],
    href: "/alumni",
    cta: "Find Mentors",
  },
  {
    icon: Briefcase,
    title: "Referral Job Board",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    description: "Browse job openings where an employee is willing to refer you directly. Skip the blind apply. These are real referrals from real insiders at top tech companies.",
    benefits: ["Referrals at top companies", "Salary range visibility", "Skill-matched listings", "Direct referrer contact", "Application tracking"],
    href: "/referrals",
    cta: "Browse Jobs",
  },
  {
    icon: Mic,
    title: "AI Mock Interviews",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    description: "Practice role-specific interview questions with our AI interviewer. Get instant, detailed feedback on content, structure, and communication quality.",
    benefits: ["Role-specific questions", "3 difficulty levels", "Per-question scoring", "Improvement tips", "Multiple practice sessions"],
    href: "/interview",
    cta: "Start Practice",
  },
  {
    icon: TrendingUp,
    title: "Progress Dashboard",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    description: "A unified view of your entire career preparation journey. Track your resume improvements, learning milestones, connection requests, and job applications in one place.",
    benefits: ["Real-time progress tracking", "Mentor connection history", "Application status", "Activity feed", "Goal completion metrics"],
    href: "/dashboard",
    cta: "View Dashboard",
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="hero-gradient pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 bg-primary/5 text-primary border-primary/20">
            <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
            Platform Features
          </Badge>
          <h1 className="text-5xl font-bold mb-4" data-testid="text-features-title">
            Six tools. One <span className="gradient-text">mission.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Everything you need to go from a great student to a hired professional — regardless of which college you attended.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gradient-bg hover:opacity-90 px-8 h-12 font-semibold" data-testid="button-features-cta">
              Get All Features Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {features.map((feature, index) => (
            <Card key={feature.title} className="overflow-hidden border-border bg-card" data-testid={`card-feature-detail-${index}`}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                <div className="p-8 lg:p-10">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{feature.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{feature.description}</p>
                  <Link href={feature.href}>
                    <Button className="gradient-bg hover:opacity-90" data-testid={`button-feature-cta-${index}`}>
                      {feature.cta} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="p-8 lg:p-10 bg-secondary/30 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">What you get</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle className={`w-4 h-4 ${feature.color} flex-shrink-0`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to use all six features?</h2>
          <p className="text-muted-foreground mb-8">Create a free account and start your career transformation today. No credit card needed.</p>
          <Link href="/signup">
            <Button size="lg" className="gradient-bg hover:opacity-90 px-10 h-12 font-semibold" data-testid="button-features-bottom-cta">
              Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
