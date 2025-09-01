import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, getAccessTokenSilently } = useAuth0();
  const { setUser, setLoading, setToken } = useAuthStore();

  useEffect(() => {
    setLoading(isLoading);

    async function fetchToken() {
      if (user && getAccessTokenSilently) {
        try {
          const token = await getAccessTokenSilently();
          setToken(token); // store token in Zustand or your state
        } catch (err) {
          console.error("fetch token:", err);
        }
      }
    }

    fetchToken();

    if (user) {
      const roles = user["https://rosehub.com/roles"] || [];
      setUser(user, roles);
    } else if (!isLoading) {
      setUser(null, []);
      setToken(null);
    }
  }, [user, isLoading, getAccessTokenSilently, setUser, setLoading, setToken]);

  return <>{children}</>;
}
