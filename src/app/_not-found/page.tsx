// src/app/_not-found/page.tsx
"use client"; // optional if you use client hooks

import React from "react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg">Page not found</p>
      </div>
    </div>
  );
}
