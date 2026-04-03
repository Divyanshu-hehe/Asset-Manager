import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetMyRoadmap, useGenerateRoadmap, useUpdateRoadmapProgress,
  getGetMyRoadmapQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { BookOpen, Loader2, CheckCircle, Clock, RotateCcw } from "lucide-react";

const schema = z.object({
  role: z.string().min(2, "Please enter a target role"),
  currentSkills: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function Roadmap() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const generateMutation = useGenerateRoadmap();
  const updateMutation = useUpdateRoadmapProgress();
  const { data: roadmap, isLoading } = useGetMyRoadmap({ query: { queryKey: getGetMyRoadmapQueryKey() } });
  const [showForm, setShowForm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "", currentSkills: "" },
  });

  const onSubmit = (data: FormData) => {
    const skillsArr = data.currentSkills ? data.currentSkills.split(",").map(s => s.trim()).filter(Boolean) : [];
    generateMutation.mutate(
      { data: { role: data.role, currentSkills: skillsArr } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetMyRoadmapQueryKey() });
          toast({ title: "Roadmap generated!", description: "Your personalized learning path is ready." });
          setShowForm(false);
        },
        onError: (err: any) => {
          toast({ title: "Generation failed", description: err?.data?.error ?? "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const toggleStep = (stepOrder: number, completed: boolean) => {
    updateMutation.mutate(
      { data: { stepOrder, completed } },
      {
        onSuccess: () => { qc.invalidateQueries({ queryKey: getGetMyRoadmapQueryKey() }); },
        onError: () => { toast({ title: "Update failed", variant: "destructive" }); },
      }
    );
  };

  const completedCount = roadmap?.completedCount ?? 0;
  const totalCount = roadmap?.totalCount ?? 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-500" />
              Learning Roadmap
            </h1>
            <p className="text-muted-foreground mt-1">Your personalized step-by-step path to your target role</p>
          </div>
          {roadmap && (
            <Button variant="outline" onClick={() => setShowForm(!showForm)} data-testid="button-regenerate-roadmap">
              <RotateCcw className="w-4 h-4 mr-2" /> Regenerate
            </Button>
          )}
        </div>

        {(!roadmap || showForm) && (
          <Card className="p-6 mb-8 border-border bg-card">
            <h2 className="font-semibold mb-4">Generate Your Roadmap</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                <Input id="role" placeholder="e.g. Frontend Developer, Data Scientist, DevOps Engineer" {...form.register("role")} data-testid="input-target-role" />
                {form.formState.errors.role && <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentSkills">Current Skills (optional, comma-separated)</Label>
                <Input id="currentSkills" placeholder="e.g. HTML, CSS, JavaScript basics" {...form.register("currentSkills")} data-testid="input-current-skills" />
              </div>
              <Button type="submit" className="gradient-bg hover:opacity-90" disabled={generateMutation.isPending} data-testid="button-generate-roadmap">
                {generateMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Roadmap"}
              </Button>
            </form>
          </Card>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {roadmap && !showForm && (
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-lg">{roadmap.role}</h2>
                  <p className="text-sm text-muted-foreground">{completedCount} of {totalCount} skills completed</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold gradient-text" data-testid="text-roadmap-progress">{progress}%</span>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={progress} className="h-3" />
              {progress === 100 && (
                <div className="mt-3 flex items-center gap-2 text-emerald-500 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Roadmap complete! You're ready for your target role.
                </div>
              )}
            </Card>

            {/* Steps by category */}
            {roadmap.steps && Object.entries(
              roadmap.steps.reduce((acc: Record<string, typeof roadmap.steps>, step) => {
                const cat = step.category || "General";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(step);
                return acc;
              }, {})
            ).map(([category, steps]) => (
              <Card key={category} className="p-6 border-border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{category}</Badge>
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {steps.filter(s => s.completed).length}/{steps.length} done
                  </span>
                </div>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div
                      key={step.order}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${step.completed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-secondary/50 border-transparent hover:border-border"}`}
                      data-testid={`step-item-${step.order}`}
                    >
                      <Checkbox
                        id={`step-${step.order}`}
                        checked={step.completed}
                        onCheckedChange={(checked) => toggleStep(step.order, checked as boolean)}
                        data-testid={`checkbox-step-${step.order}`}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <label htmlFor={`step-${step.order}`} className={`text-sm font-medium cursor-pointer ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                          {step.skill}
                        </label>
                        {step.resource && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {step.resource}
                          </p>
                        )}
                      </div>
                      {step.completed && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
