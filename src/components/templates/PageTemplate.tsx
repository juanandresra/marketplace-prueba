// Template: Estructura base de página
// Envuelve el contenido principal y aplica layout general
// PageTemplate.tsx
// Template: Estructura base para páginas principales (layout, paddings, ancho)

import { ReactNode } from "react";

interface PageTemplateProps {
  children: ReactNode;
  className?: string;
}

export default function PageTemplate({ children, className = "" }: PageTemplateProps) {
  // Render del layout base
  return (
    <div className={`w-full p-4 ${className}`}>
      {children}
    </div>
  );
}
