import { useAuth } from "@/lib/auth-context";
import { Route, Redirect } from "wouter";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

export default function PrivateRoute({ component: Component, path }: PrivateRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) return null; // or a spinner/loading screen

  return (
    <Route
      path={path}
      component={(params) =>
        currentUser ? <Component {...params} /> : <Redirect to="/login" />
      }
    />
  );
}
