// Organism: Botón para eliminar tienda
// Permite eliminar una tienda existente
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteStoreButtonProps {
  storeId: string;
}

export default function DeleteStoreButton({
  storeId,
}: DeleteStoreButtonProps) {
  // Hooks de estado y navegación
   const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar esta tienda?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/store/${storeId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.errors?.join(", ") || "Error eliminando la tienda");
        setLoading(false);
        return;
      }

      
      router.push(`/stores/me`);
      router.refresh();

    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`btn btn-error btn-sm ${loading ? "loading" : ""}`}
        onClick={handleDelete}
        disabled={loading}
      >
        Eliminar
      </button>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </>
  );
}
