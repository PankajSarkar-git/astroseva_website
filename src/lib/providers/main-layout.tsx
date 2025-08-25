// app/providers.tsx
"use client";

import { Toaster } from "react-hot-toast";
import StoreProvider from "./redux-provider";
import ProtectedRoute from "./ProtectedRoute";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ProtectedRoute>
        {children}
        <Toaster />
      </ProtectedRoute>
    </StoreProvider>
  );
}
