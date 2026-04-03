import { useState } from "react";
import { useListMentors, useApplyReferral, getListMentorsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { Briefcase, Search, Loader2, Building, MapPin, DollarSign, CheckCircle, ExternalLink } from "lucide-react";

const referralData = [
  { id: 1, company: "Google", role: "Software Engineer (L3)", location: "Bangalore, India", salary: "₹25–35 LPA", postedBy: "Arjun Mehta", referrerCollege: "NIT Trichy → Google", skills: ["Python", "Data Structures", "System Design"], isApplied: false },
  { id: 2, company: "Microsoft", role: "Frontend Developer", location: "Hyderabad, India", salary: "₹20–28 LPA", postedBy: "Sneha Iyer", referrerCollege: "BITS Pilani → Microsoft", skills: ["React", "TypeScript", "CSS"], isApplied: false },
  { id: 3, company: "Amazon", role: "Data Scientist", location: "Remote / Bangalore", salary: "₹18–26 LPA", postedBy: "Vikram Rao", referrerCollege: "VIT Chennai → Amazon", skills: ["Machine Learning", "Python", "SQL"], isApplied: false },
  { id: 4, company: "Flipkart", role: "Backend Engineer", location: "Bangalore, India", salary: "₹16–22 LPA", postedBy: "Kavya Sharma", referrerCollege: "DTU → Flipkart", skills: ["Java", "Spring Boot", "Kafka"], isApplied: false },
  { id: 5, company: "Atlassian", role: "Full Stack Developer", location: "Pune, India", salary: "₹22–30 LPA", postedBy: "Prashant Gupta", referrerCollege: "IIIT Hyderabad → Atlassian", skills: ["React", "Node.js", "AWS"], isApplied: false },
  { id: 6, company: "Razorpay", role: "Product Engineer", location: "Bangalore, India", salary: "₹18–25 LPA", postedBy: "Neha Kulkarni", referrerCollege: "COEP → Razorpay", skills: ["Go", "Redis", "PostgreSQL"], isApplied: false },
];

export default function Referrals() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [applying, setApplying] = useState<number | null>(null);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const applyMutation = useApplyReferral();

  const filtered = referralData.filter(r =>
    search === "" ||
    r.company.toLowerCase().includes(search.toLowerCase()) ||
    r.role.toLowerCase().includes(search.toLowerCase()) ||
    r.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApply = (id: number) => {
    setApplying(id);
    applyMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setApplied(prev => new Set(prev).add(id));
          toast({ title: "Application submitted!", description: "The referrer has been notified. Expect a response in 2–3 days." });
          setApplying(null);
        },
        onError: (err: any) => {
          const msg = err?.data?.error ?? "Please try again.";
          if (msg.toLowerCase().includes("already")) {
            setApplied(prev => new Set(prev).add(id));
          }
          toast({ title: "Application failed", description: msg, variant: "destructive" });
          setApplying(null);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-orange-500" />
            Referral Job Board
          </h1>
          <p className="text-muted-foreground mt-1">Jobs with built-in referrals from employees at top companies</p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by company, role, or skill..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-referral-search"
          />
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No referrals found{search ? ` for "${search}"` : ""}.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((referral) => {
            const isApplied = applied.has(referral.id) || referral.isApplied;
            return (
              <Card key={referral.id} className="p-6 border-border bg-card card-hover flex flex-col" data-testid={`card-referral-${referral.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Referral Available</Badge>
                </div>

                <h3 className="font-semibold mb-1" data-testid={`text-referral-role-${referral.id}`}>{referral.role}</h3>
                <p className="text-primary font-medium text-sm mb-3">{referral.company}</p>

                <div className="space-y-1.5 mb-4 flex-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {referral.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <DollarSign className="w-3.5 h-3.5" />
                    {referral.salary}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {referral.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>

                <div className="border-t border-border pt-3 mb-4">
                  <p className="text-xs text-muted-foreground">Referred by</p>
                  <p className="text-sm font-medium">{referral.postedBy}</p>
                  <p className="text-xs text-muted-foreground">{referral.referrerCollege}</p>
                </div>

                {isApplied ? (
                  <Button variant="outline" size="sm" className="w-full border-emerald-500/30 text-emerald-600" disabled data-testid={`button-applied-${referral.id}`}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Applied
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full gradient-bg hover:opacity-90"
                    onClick={() => handleApply(referral.id)}
                    disabled={applying === referral.id}
                    data-testid={`button-apply-referral-${referral.id}`}
                  >
                    {applying === referral.id ? (
                      <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Applying...</>
                    ) : (
                      <><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Request Referral</>
                    )}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
