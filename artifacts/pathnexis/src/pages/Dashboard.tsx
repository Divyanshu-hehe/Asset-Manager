import { Link } from "wouter";
import { useGetDashboardSummary, useGetLatestResume, useGetMyRoadmap, getGetDashboardSummaryQueryKey, getGetLatestResumeQueryKey, getGetMyRoadmapQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import {
  Brain, BookOpen, Users, Briefcase, Mic, TrendingUp,
  ArrowRight, FileText, Zap, AlertCircle, CheckCircle,
  Clock, Activity
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color, href }: { icon: any; label: string; value: string | number; color: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="p-5 border-border bg-card card-hover cursor-pointer" data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

const activityIcons: Record<string, any> = {
  resume: FileText,
  roadmap: BookOpen,
  connection: Users,
  application: Briefcase,
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  const { data: resume } = useGetLatestResume({ query: { queryKey: getGetLatestResumeQueryKey() } });
  const { data: roadmap } = useGetMyRoadmap({ query: { queryKey: getGetMyRoadmapQueryKey() } });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">Here's your career progress overview</p>
        </div>

        {/* Quick Actions */}
        {!summary?.resumeScore && !summaryLoading && (
          <Card className="p-6 mb-8 border-primary/30 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Get started with PathNexis AI</h3>
                <p className="text-sm text-muted-foreground mb-4">Analyze your resume to unlock your personalized career plan</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/resume"><Button size="sm" className="gradient-bg hover:opacity-90" data-testid="button-analyze-resume">Analyze Resume</Button></Link>
                  <Link href="/roadmap"><Button size="sm" variant="outline" data-testid="button-generate-roadmap">Generate Roadmap</Button></Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Brain}
            label="Resume Score"
            value={summary?.resumeScore != null ? `${summary.resumeScore}/100` : "--"}
            color="bg-violet-500/10 text-violet-500"
            href="/resume"
          />
          <StatCard
            icon={BookOpen}
            label="Roadmap Progress"
            value={summary?.roadmapProgress != null ? `${summary.roadmapProgress}%` : "--"}
            color="bg-blue-500/10 text-blue-500"
            href="/roadmap"
          />
          <StatCard
            icon={Users}
            label="Mentor Connections"
            value={summary?.mentorConnections ?? 0}
            color="bg-emerald-500/10 text-emerald-500"
            href="/alumni"
          />
          <StatCard
            icon={Briefcase}
            label="Job Applications"
            value={summary?.jobApplications ?? 0}
            color="bg-orange-500/10 text-orange-500"
            href="/referrals"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume */}
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-violet-500" />
                  Resume Analysis
                </h2>
                <Link href="/resume">
                  <Button variant="ghost" size="sm" className="text-primary" data-testid="button-view-resume">View <ArrowRight className="ml-1 w-3.5 h-3.5" /></Button>
                </Link>
              </div>
              {resume ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Overall Score</span>
                    <span className="text-2xl font-bold gradient-text" data-testid="text-resume-score">{resume.score}/100</span>
                  </div>
                  <Progress value={resume.score} className="h-2 mb-4" />
                  {resume.skillGaps.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 text-muted-foreground">Skill Gaps to Address</p>
                      <div className="flex flex-wrap gap-2">
                        {resume.skillGaps.slice(0, 4).map((gap) => (
                          <Badge key={gap} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 text-xs" data-testid={`badge-skill-gap-${gap}`}>{gap}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No resume analyzed yet</p>
                  <Link href="/resume">
                    <Button size="sm" className="gradient-bg hover:opacity-90" data-testid="button-analyze-first-resume">Analyze Resume</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Roadmap */}
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Learning Roadmap
                  {roadmap && <Badge variant="secondary" className="text-xs">{roadmap.role}</Badge>}
                </h2>
                <Link href="/roadmap">
                  <Button variant="ghost" size="sm" className="text-primary" data-testid="button-view-roadmap">View <ArrowRight className="ml-1 w-3.5 h-3.5" /></Button>
                </Link>
              </div>
              {roadmap ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{roadmap.completedCount} of {roadmap.totalCount} skills completed</span>
                    <span className="text-sm font-semibold gradient-text">{summary?.roadmapProgress ?? 0}%</span>
                  </div>
                  <Progress value={summary?.roadmapProgress ?? 0} className="h-2 mb-4" />
                  <div className="space-y-2">
                    {roadmap.steps.slice(0, 3).map((step) => (
                      <div key={step.order} className="flex items-center gap-2.5 text-sm">
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                        )}
                        <span className={step.completed ? "text-muted-foreground line-through" : ""}>{step.skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No roadmap generated yet</p>
                  <Link href="/roadmap">
                    <Button size="sm" className="gradient-bg hover:opacity-90" data-testid="button-generate-first-roadmap">Generate Roadmap</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Access */}
            <Card className="p-6 border-border bg-card">
              <h2 className="font-semibold mb-4">Quick Access</h2>
              <div className="space-y-2">
                {[
                  { href: "/alumni", icon: Users, label: "Find Mentors", color: "text-emerald-500" },
                  { href: "/referrals", icon: Briefcase, label: "Browse Jobs", color: "text-orange-500" },
                  { href: "/interview", icon: Mic, label: "Practice Interview", color: "text-pink-500" },
                  { href: "/resume", icon: TrendingUp, label: "Improve Resume", color: "text-violet-500" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer group" data-testid={`link-quick-access-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 border-border bg-card">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                Recent Activity
              </h2>
              {summary?.recentActivity && summary.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {summary.recentActivity.map((activity, i) => {
                    const Icon = activityIcons[activity.type] ?? Clock;
                    return (
                      <div key={i} className="flex items-start gap-2.5 text-sm" data-testid={`activity-item-${i}`}>
                        <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-foreground leading-snug">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No activity yet. Start by analyzing your resume!</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
