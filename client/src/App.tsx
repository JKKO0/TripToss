import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PlanTrip from "@/pages/plan-trip";
import TripDetails from "@/pages/trip-details";
import SavedTrips from "@/pages/saved-trips";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PrivateRoute from "@/components/PrivateRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <PrivateRoute path="/plan-trip" component={PlanTrip} />
      <PrivateRoute path="/trip/:id" component={TripDetails} />
      <PrivateRoute path="/saved-trips" component={SavedTrips} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
