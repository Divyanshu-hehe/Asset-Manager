import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Brain, Users, BookOpen, Briefcase, Mic, TrendingUp,
  ArrowRight, CheckCircle, Star, ChevronRight, Zap,
  GraduationCap, Award, Network
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const problems = [
  { icon: GraduationCap, title: "No Guidance", desc: "Students have raw talent but no roadmap. Top mentors are inaccessible to those outside elite campuses." },
  { icon: Award, title: "Poor Resume", desc: "Without ATS knowledge or resume coaches, even strong profiles get rejected before a human ever sees them." },
  { icon: Network, title: "No Network", desc: "Placement cells in Tier 3/4 colleges are underfunded. 80% of jobs are filled through referrals, not portals." },
  { icon: Briefcase, title: "No Referrals", desc: "Without alumni in top companies, students miss the single most effective shortcut to getting hired." },
];

const features = [
  { icon: Brain, title: "AI Resume Analyzer", desc: "Get an instant score, ATS keywords, and actionable improvements to make your resume stand out.", color: "text-violet-500", bg: "bg-violet-500/10" },
  { icon: BookOpen, title: "Personalized Roadmap", desc: "A step-by-step learning path tailored to your target role, built by AI based on your current skills.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Users, title: "Alumni Mentorship", desc: "Connect with alumni at top companies who were once in your exact position. Real mentors, real stories.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Briefcase, title: "Referral Marketplace", desc: "Browse job openings with built-in referrals from employees at top companies. Skip the blind apply.", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Mic, title: "AI Mock Interviews", desc: "Practice with role-specific questions and get instant feedback on your answers.", color: "text-pink-500", bg: "bg-pink-500/10" },
  { icon: TrendingUp, title: "Progress Tracker", desc: "Track your skill development and interview readiness in one unified dashboard.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

const testimonials = [
  { name: "Priya Menon", college: "NITTE Institute of Technology", company: "Google", quote: "PathNexis helped me understand exactly what was missing in my resume. Within 3 months I had an offer from Google.", avatar: "PM" },
  { name: "Rahul Soni", college: "SRM University", company: "Amazon", quote: "The mentor I connected with through PathNexis was from my own college. He referred me directly. That's the network I never had.", avatar: "RS" },
  { name: "Divya Krishnan", college: "VIT Bhopal", company: "Microsoft", quote: "I was applying blindly for 8 months. PathNexis showed me exactly what to fix. Now I'm at Microsoft.", avatar: "DK" },
];

const stats = [
  { value: "15,000+", label: "Students Placed" },
  { value: "500+", label: "Mentors Onboard" },
  { value: "89%", label: "Placement Rate" },
  { value: "3x", label: "Resume Score Boost" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="hero-gradient pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium border border-primary/20 bg-primary/5 text-primary" data-testid="badge-hero">
            <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
            AI-Powered Career Platform for Tier 3/4 Students
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight" data-testid="text-hero-title">
            Bridging{" "}
            <span className="gradient-text">Talent to</span>
            <br />
            Opportunity
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed" data-testid="text-hero-description">
            Your college name shouldn't define your career ceiling. PathNexis AI gives you the resume analysis,
            learning roadmaps, alumni connections, and referrals that top-tier students take for granted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="gradient-bg hover:opacity-90 transition-opacity px-8 h-12 text-base font-semibold shadow-lg" data-testid="button-hero-cta">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg" className="px-8 h-12 text-base font-semibold" data-testid="button-hero-features">
                See Features
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {["No credit card required", "Free resume analysis", "500+ mentors ready"].map((text) => (
              <div key={text} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-destructive/10 text-destructive border-destructive/20">The Problem</Badge>
            <h2 className="text-4xl font-bold mb-4">The playing field isn't level</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Students from Tier 3/4 colleges face systemic barriers that have nothing to do with their abilities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem) => (
              <Card key={problem.title} className="p-6 card-hover border-border bg-card" data-testid={`card-problem-${problem.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <problem.icon className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-semibold text-base mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{problem.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">The Solution</Badge>
          <h2 className="text-4xl font-bold mb-6">One AI-powered ecosystem</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            PathNexis combines resume intelligence, structured learning, alumni mentorship, and direct referrals
            into one platform. Everything top-tier students have — now available to everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { step: "01", title: "Analyze", desc: "Upload your resume. Get an instant AI score, ATS keywords, and specific improvements.", icon: Brain },
              { step: "02", title: "Learn", desc: "Follow a personalized roadmap to fill skill gaps for your target role, step by step.", icon: BookOpen },
              { step: "03", title: "Connect", desc: "Get matched with mentors and referrals from real people at companies you want to join.", icon: Users },
            ].map((item) => (
              <Card key={item.step} className="p-6 bg-card border-border" data-testid={`card-solution-${item.step}`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl font-bold gradient-text opacity-40">{item.step}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Everything you need to get hired</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 card-hover border-border bg-card group" data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/features">
              <Button variant="outline" size="lg" data-testid="button-view-all-features">
                View All Features <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">Stories</Badge>
            <h2 className="text-4xl font-bold mb-4">Students who made the leap</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 border-border bg-card card-hover" data-testid={`card-testimonial-${t.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.college}</div>
                    <div className="text-xs text-primary font-medium mt-0.5">Now at {t.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent border border-primary/20 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Your college is not your destiny</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Thousands of students have already started their journeys with PathNexis AI. Your resume analysis is free. Your roadmap is ready.
              </p>
              <Link href="/signup">
                <Button size="lg" className="gradient-bg hover:opacity-90 transition-opacity px-10 h-12 text-base font-semibold shadow-xl" data-testid="button-cta-bottom">
                  Start For Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
