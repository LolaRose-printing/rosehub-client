"use client";

import { NextPage } from "next";
import { SignIn } from "@/components/SignIn";
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from "react";

const Page: NextPage = () => {
  const { user } = useAuth();

  // If already authenticated, redirect to home
  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  // Show sign in form if not authenticated
  if (!user) {
    return <SignIn />;
  }

  // Will redirect via useEffect
  return null;
}

export default Page;
