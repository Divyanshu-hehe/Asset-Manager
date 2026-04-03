import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Zap, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  college: z.string().optional(),
  year: z.string().optional(),
  skills: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const signupMutation = useSignup();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", college: "", year: "", skills: "" },
  });

  const onSubmit = async (data: FormData) => {
    const skillsArray = data.skills ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
    signupMutation.mutate(
      { data: { name: data.name, email: data.email, password: data.password, college: data.college, year: data.year, skills: skillsArray } },
      {
        onSuccess: (result) => {
          login(result.token, result.user);
          toast({ title: "Account created!", description: `Welcome to PathNexis, ${result.user.name}!` });
          setLocation("/dashboard");
        },
        onError: (err: any) => {
          toast({ title: "Signup failed", description: err?.data?.error ?? "Something went wrong.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background hero-gradient flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">PathNexis AI</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Start your journey</h1>
            <p className="text-muted-foreground">Create your account — it's free</p>
          </div>

          <Card className="p-8 border-border bg-card shadow-xl">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Rahul Kumar" {...form.register("name")} data-testid="input-name" />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} data-testid="input-email" />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min 8 characters" {...form.register("password")} data-testid="input-password" />
                {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="college">College (optional)</Label>
                  <Input id="college" placeholder="Your college" {...form.register("college")} data-testid="input-college" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year (optional)</Label>
                  <Input id="year" placeholder="e.g. 3rd Year" {...form.register("year")} data-testid="input-year" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (optional, comma-separated)</Label>
                <Input id="skills" placeholder="React, Python, SQL" {...form.register("skills")} data-testid="input-skills" />
              </div>

              <Button
                type="submit"
                className="w-full gradient-bg hover:opacity-90 transition-opacity h-11 mt-2"
                disabled={signupMutation.isPending}
                data-testid="button-submit-signup"
              >
                {signupMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline" data-testid="link-login">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
