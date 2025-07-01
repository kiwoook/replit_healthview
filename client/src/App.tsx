import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Routines from "@/pages/routines";
import RoutineDetail from "@/pages/routine-detail";
import Trainers from "@/pages/trainers";
import TrainerProfile from "@/pages/trainer-profile";
import CreateRoutine from "@/pages/create-routine";
import Community from "@/pages/community";
import Profile from "@/pages/profile";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/routines" component={Routines} />
          <Route path="/routines/:id" component={RoutineDetail} />
          <Route path="/trainers" component={Trainers} />
          <Route path="/trainers/:id" component={TrainerProfile} />
          <Route path="/create-routine" component={CreateRoutine} />
          <Route path="/community" component={Community} />
          <Route path="/profile" component={Profile} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
