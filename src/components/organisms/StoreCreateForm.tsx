// Organism: Formulario de creación de tienda
// Permite crear una nueva tienda
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave } from "react-icons/fa";

interface StoreFormProps {
  onSubmit?: () => void;
}

export default function StoreCreateForm({ onSubmit }: StoreFormProps) {
  // Hooks de estado y navegación
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Estado para errores, lo dejamos tipo string[] (podrías mapear por campo si quieres)
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          image: imageUrl,
        }),
      });
  // ...existing code...

      const data = await res.json();

      if (!res.ok) {
        // Backend devuelve errors array
        setErrors(data.errors || ["Error desconocido"]);
        setIsSubmitting(false);
        return;
      }

      // Éxito
      if (onSubmit) onSubmit();
      router.push("/stores/me");
    } catch {
      setErrors(["Error de red, intenta de nuevo"]);
      setIsSubmitting(false);
    }
  };

  // Función auxiliar para detectar si hay error en campo (básico)
  const hasError = (fieldName: string) =>
    errors.some((e) => e.toLowerCase().includes(fieldName));

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md rounded-xl p-8 space-y-6 w-full">
      {/* Errores generales */}
      {errors.length > 0 && (
        <div className="alert alert-error shadow-lg">
          <ul className="list-disc list-inside">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Nombre */}
      <div className="form-control">
        <label htmlFor="name" className="label mb-2">
          <span className="label-text">Nombre de la tienda</span>
        </label>
        <input
          type="text"
          id="name"
          className={`input input-bordered w-full ${hasError("name") ? "input-error" : ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {hasError("name") && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.find((e) => e.toLowerCase().includes("name"))}
            </span>
          </label>
        )}
      </div>

      {/* Descripción */}
      <div className="form-control">
        <label htmlFor="description" className="label mb-2">
          <span className="label-text">Descripción</span>
        </label>
        <textarea
          id="description"
          className={`textarea textarea-bordered w-full ${hasError("description") ? "input-error" : ""}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {hasError("description") && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.find((e) => e.toLowerCase().includes("description"))}
            </span>
          </label>
        )}
      </div>

      {/* Imagen (URL) */}
      <div className="form-control">
        <label htmlFor="imageUrl" className="label mb-2">
          <span className="label-text">URL de la imagen</span>
        </label>
        <input
          type="url"
          id="imageUrl"
          placeholder="https://ejemplo.com/imagen.jpg"
          className={`input input-bordered w-full ${hasError("image") ? "input-error" : ""}`}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isSubmitting}
        />
        {hasError("image") && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.find((e) => e.toLowerCase().includes("image"))}
            </span>
          </label>
        )}
      </div>

      {/* Botón */}
      <div className="form-control mt-6">
        <button
          type="submit"
          className={`btn btn-primary w-full flex justify-center items-center gap-2 ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          <span>Guardar</span>
          <FaSave />
        </button>
      </div>
    </form>
  );
}
