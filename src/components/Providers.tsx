// Provider: Proveedor de contexto de sesión
// Envuelve la app con el SessionProvider de next-auth
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Render del proveedor de sesión
  return <SessionProvider>{children}</SessionProvider>;
}
