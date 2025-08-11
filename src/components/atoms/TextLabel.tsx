// TextLabel.tsx
// Átomo: Etiqueta de texto reutilizable
// Atom: Etiqueta de texto reutilizable
// Permite mostrar texto con estilos consistentes

import { ReactNode } from "react";

interface TextLabelProps {
  children: ReactNode;
  className?: string;
}

export default function TextLabel({ children, className = "" }: TextLabelProps) {
  // Render de la etiqueta de texto
  return (
    <span className={`text-base-content/70 ${className}`}>{children}</span>
  );
}
