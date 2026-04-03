import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";

// Pages
import Home from "@/pages/Home";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Resume from "@/pages/Resume";
import Roadmap from "@/pages/Roadmap";
import Alumni from "@/pages/Alumni";
import Referrals from "@/pages/Referrals";
import Interview from "@/pages/Interview";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  if (!isLoggedIn) return <Redirect to="/login" />;
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/features" component={Features} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/resume">
        {() => <ProtectedRoute component={Resume} />}
      </Route>
      <Route path="/roadmap">
        {() => <ProtectedRoute component={Roadmap} />}
      </Route>
      <Route path="/alumni">
        {() => <ProtectedRoute component={Alumni} />}
      </Route>
      <Route path="/referrals">
        {() => <ProtectedRoute component={Referrals} />}
      </Route>
      <Route path="/interview">
        {() => <ProtectedRoute component={Interview} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
