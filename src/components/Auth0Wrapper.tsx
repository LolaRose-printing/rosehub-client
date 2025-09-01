"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function MyComponent() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>Welcome, {user?.name}</div>;
}
