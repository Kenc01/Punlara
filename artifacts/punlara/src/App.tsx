import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Trees from "@/pages/Trees";
import Adopt from "@/pages/Adopt";
import MyTree from "@/pages/MyTree";
import Gift from "@/pages/Gift";
import TreeProfile from "@/pages/TreeProfile";
import Admin from "@/pages/Admin";
import FarmerRegister from "@/pages/FarmerRegister";
import FarmerDashboard from "@/pages/FarmerDashboard";
import FarmerProfile from "@/pages/FarmerProfile";

const queryClient = new QueryClient();

function ClerkTokenSync() {
  const { getToken, isSignedIn } = useClerkAuth();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  return null;
}

function UserSync() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useClerkAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const syncUser = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress ?? null,
            firstName: user.firstName ?? null,
            lastName: user.lastName ?? null,
            profileImageUrl: user.imageUrl ?? null,
          }),
        });
      } catch {
        // Non-critical — profile data will sync on next request
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trees" component={Trees} />
      <Route path="/adopt" component={Adopt} />
      <Route path="/my-tree" component={MyTree} />
      <Route path="/gift" component={Gift} />
      <Route path="/tree/:id" component={TreeProfile} />
      <Route path="/admin" component={Admin} />
      <Route path="/become-a-farmer" component={FarmerRegister} />
      <Route path="/farmer-dashboard" component={FarmerDashboard} />
      <Route path="/farm/:id" component={FarmerProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ClerkTokenSync />
        <UserSync />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
