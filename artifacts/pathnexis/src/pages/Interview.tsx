import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStartInterview, useSubmitInterview } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { Mic, Loader2, CheckCircle, ArrowRight, RotateCcw, TrendingUp, AlertCircle, ChevronRight } from "lucide-react";

const setupSchema = z.object({ role: z.string().min(2, "Please enter a role"), difficulty: z.enum(["easy", "medium", "hard"]) });
type SetupData = z.infer<typeof setupSchema>;

type SessionState = "setup" | "answering" | "results";

interface SessionData {
  id: number;
  role: string;
  questions: string[];
  currentIndex: number;
  answers: string[];
  feedback?: Array<{ score: number; feedback: string; tips: string[] }>;
  overallScore?: number;
}

export default function Interview() {
  const { toast } = useToast();
  const [state, setState] = useState<SessionState>("setup");
  const [session, setSession] = useState<SessionData | null>(null);
  const [answer, setAnswer] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const startMutation = useStartInterview();
  const submitMutation = useSubmitInterview();

  const form = useForm<SetupData>({
    resolver: zodResolver(setupSchema),
    defaultValues: { role: "", difficulty: "medium" },
  });

  const handleStart = (data: SetupData) => {
    startMutation.mutate(
      { data: { role: data.role, difficulty: data.difficulty } },
      {
        onSuccess: (result) => {
          setSession({ id: result.id, role: result.role, questions: result.questions, currentIndex: 0, answers: [] });
          setState("answering");
        },
        onError: (err: any) => {
          toast({ title: "Failed to start", description: err?.data?.error ?? "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const handleSubmitAnswer = async () => {
    if (!session || !answer.trim()) return;
    setLoadingSubmit(true);
    submitMutation.mutate(
      { data: { sessionId: session.id, questionIndex: session.currentIndex, answer: answer.trim() } },
      {
        onSuccess: (result) => {
          const newAnswers = [...session.answers, answer.trim()];
          const isLast = session.currentIndex === session.questions.length - 1;
          if (isLast) {
            setSession({ ...session, answers: newAnswers, feedback: result.feedback, overallScore: result.overallScore });
            setState("results");
          } else {
            setSession({ ...session, answers: newAnswers, currentIndex: session.currentIndex + 1 });
            setAnswer("");
          }
          setLoadingSubmit(false);
        },
        onError: (err: any) => {
          toast({ title: "Submission failed", description: err?.data?.error ?? "Please try again.", variant: "destructive" });
          setLoadingSubmit(false);
        },
      }
    );
  };

  const resetSession = () => {
    setSession(null);
    setAnswer("");
    setState("setup");
    form.reset();
  };

  const difficultyColor = { easy: "bg-emerald-500/10 text-emerald-600", medium: "bg-amber-500/10 text-amber-600", hard: "bg-destructive/10 text-destructive" };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mic className="w-7 h-7 text-pink-500" />
            AI Mock Interview
          </h1>
          <p className="text-muted-foreground mt-1">Practice role-specific questions and get instant AI feedback</p>
        </div>

        {state === "setup" && (
          <Card className="p-8 border-border bg-card">
            <h2 className="font-semibold text-xl mb-6">Configure Your Interview</h2>
            <form onSubmit={form.handleSubmit(handleStart)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                <Input id="role" placeholder="e.g. Frontend Developer, Data Analyst" {...form.register("role")} data-testid="input-interview-role" />
                {form.formState.errors.role && <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <div className="grid grid-cols-3 gap-3">
                  {(["easy", "medium", "hard"] as const).map((d) => (
                    <label key={d} className="cursor-pointer">
                      <input type="radio" value={d} {...form.register("difficulty")} className="sr-only" />
                      <div className={`text-center py-2.5 rounded-lg border-2 transition-colors capitalize font-medium text-sm ${
                        form.watch("difficulty") === d ? "border-primary gradient-bg text-white" : "border-border bg-secondary hover:border-primary/40"
                      }`} data-testid={`button-difficulty-${d}`}>
                        {d}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full gradient-bg hover:opacity-90 h-11" disabled={startMutation.isPending} data-testid="button-start-interview">
                {startMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up...</> : <><Mic className="mr-2 h-4 w-4" /> Start Interview</>}
              </Button>
            </form>
          </Card>
        )}

        {state === "answering" && session && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Question {session.currentIndex + 1} of {session.questions.length}</span>
              <Badge variant="secondary" className={`text-xs ${difficultyColor[form.getValues("difficulty")]}`}>{form.getValues("difficulty")}</Badge>
            </div>
            <Progress value={((session.currentIndex) / session.questions.length) * 100} className="h-2" />

            <Card className="p-6 border-primary/30 bg-primary/5">
              <p className="font-medium leading-relaxed" data-testid="text-interview-question">{session.questions[session.currentIndex]}</p>
            </Card>

            <Card className="p-6 border-border bg-card">
              <Label htmlFor="answer" className="block mb-2 font-medium">Your Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here. Be as detailed as possible — the AI evaluates depth, relevance, and structure..."
                rows={8}
                data-testid="textarea-interview-answer"
                className="resize-none"
              />
              <Button
                className="mt-4 gradient-bg hover:opacity-90 w-full"
                onClick={handleSubmitAnswer}
                disabled={!answer.trim() || loadingSubmit}
                data-testid="button-submit-answer"
              >
                {loadingSubmit ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</> : (
                  session.currentIndex < session.questions.length - 1
                    ? <><ArrowRight className="mr-2 h-4 w-4" /> Next Question</>
                    : <><CheckCircle className="mr-2 h-4 w-4" /> Finish Interview</>
                )}
              </Button>
            </Card>
          </div>
        )}

        {state === "results" && session && (
          <div className="space-y-6">
            <Card className="p-8 border-border bg-card text-center">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Interview Complete!</h2>
              <p className="text-muted-foreground mb-4">Role: {session.role}</p>
              <div className="text-5xl font-bold gradient-text mb-2" data-testid="text-overall-score">{session.overallScore}/100</div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <Progress value={session.overallScore ?? 0} className="h-3 mt-4 max-w-xs mx-auto" />
            </Card>

            {session.feedback && session.feedback.map((fb, i) => (
              <Card key={i} className="p-6 border-border bg-card" data-testid={`card-feedback-${i}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm text-muted-foreground">Question {i + 1}</h3>
                  <Badge variant="secondary" className={`text-xs ${fb.score >= 80 ? "bg-emerald-500/10 text-emerald-600" : fb.score >= 60 ? "bg-amber-500/10 text-amber-600" : "bg-destructive/10 text-destructive"}`}>
                    Score: {fb.score}/100
                  </Badge>
                </div>
                <p className="text-sm italic text-muted-foreground mb-3 border-l-2 border-primary/30 pl-3">"{session.questions[i]}"</p>
                <p className="text-sm leading-relaxed mb-3">{fb.feedback}</p>
                {fb.tips.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tips to Improve</p>
                    <ul className="space-y-1">
                      {fb.tips.map((tip, ti) => (
                        <li key={ti} className="text-sm flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={resetSession} data-testid="button-restart-interview">
              <RotateCcw className="mr-2 h-4 w-4" /> Practice Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
