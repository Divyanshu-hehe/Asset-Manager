import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnalyzeResume, useGetLatestResume, getGetLatestResumeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { Brain, CheckCircle, AlertCircle, TrendingUp, Loader2, RotateCcw } from "lucide-react";

const schema = z.object({
  content: z.string().min(50, "Please paste at least 50 characters of your resume"),
  targetRole: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-destructive";
  return (
    <div className="flex flex-col items-center">
      <div className={`text-6xl font-bold ${color}`} data-testid="text-resume-score">{score}</div>
      <div className="text-sm text-muted-foreground">/100</div>
      <Progress value={score} className="w-32 h-2 mt-2" />
    </div>
  );
}

export default function Resume() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const analyzeMutation = useAnalyzeResume();
  const { data: latestResume, isLoading } = useGetLatestResume({ query: { queryKey: getGetLatestResumeQueryKey() } });
  const [showForm, setShowForm] = useState(!latestResume);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { content: "", targetRole: "" },
  });

  const onSubmit = (data: FormData) => {
    analyzeMutation.mutate(
      { data: { content: data.content, targetRole: data.targetRole || undefined } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetLatestResumeQueryKey() });
          toast({ title: "Resume analyzed!", description: "Your resume score is ready." });
          setShowForm(false);
        },
        onError: (err: any) => {
          toast({ title: "Analysis failed", description: err?.data?.error ?? "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const resume = latestResume;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="w-7 h-7 text-violet-500" />
              AI Resume Analyzer
            </h1>
            <p className="text-muted-foreground mt-1">Get an instant score and actionable improvements</p>
          </div>
          {resume && !showForm && (
            <Button variant="outline" onClick={() => setShowForm(true)} data-testid="button-reanalyze">
              <RotateCcw className="w-4 h-4 mr-2" /> Reanalyze
            </Button>
          )}
        </div>

        {(showForm || !resume) && (
          <Card className="p-6 mb-8 border-border bg-card">
            <h2 className="font-semibold mb-4">Paste Your Resume</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetRole">Target Role (optional)</Label>
                <Input id="targetRole" placeholder="e.g. Frontend Developer, Data Scientist" {...form.register("targetRole")} data-testid="input-target-role" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Resume Content</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your entire resume text here..."
                  rows={12}
                  {...form.register("content")}
                  data-testid="textarea-resume-content"
                  className="font-mono text-sm"
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
                )}
              </div>
              <Button type="submit" className="gradient-bg hover:opacity-90" disabled={analyzeMutation.isPending} data-testid="button-analyze-resume">
                {analyzeMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : "Analyze Resume"}
              </Button>
            </form>
          </Card>
        )}

        {resume && !showForm && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-border bg-card text-center md:col-span-1">
                <h2 className="font-semibold mb-4">Resume Score</h2>
                <ScoreCircle score={resume.score} />
                {resume.targetRole && (
                  <Badge variant="secondary" className="mt-3 bg-primary/10 text-primary border-primary/20">
                    Target: {resume.targetRole}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  Analyzed {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </Card>

              <div className="md:col-span-2 space-y-4">
                <Card className="p-6 border-border bg-card">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {resume.strengths.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2" data-testid={`text-strength-${i}`}>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 border-border bg-card">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" /> Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {resume.suggestions.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2" data-testid={`text-suggestion-${i}`}>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>

            <Card className="p-6 border-border bg-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" /> Skill Gaps
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.skillGaps.map((gap) => (
                  <Badge key={gap} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20" data-testid={`badge-skill-gap-${gap}`}>
                    {gap}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
