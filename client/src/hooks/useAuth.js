import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

// Get JWT token from localStorage
export function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Save JWT token to localStorage
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Save JWT token to localStorage
      if (data.token) {
        setAuthToken(data.token);
      }
      // Refetch user data with new token
      refetch();
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Signup failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Save JWT token to localStorage
      if (data.token) {
        setAuthToken(data.token);
      }
      // Refetch user data with new token
      refetch();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      // Clear token from localStorage
      setAuthToken(null);
      // Invalidate user query
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      refetch();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: (email, password) => loginMutation.mutateAsync({ email, password }),
    signup: (email, password, firstName, lastName) =>
      signupMutation.mutateAsync({ email, password, firstName, lastName }),
    logout: () => logoutMutation.mutateAsync(),
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
