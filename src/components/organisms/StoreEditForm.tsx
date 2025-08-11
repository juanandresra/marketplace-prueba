// Organism: Formulario de edición de tienda
// Permite editar los datos de una tienda existente
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "@prisma/client";
import { FaSave } from "react-icons/fa";

interface StoreEditFormProps {
  store: Store;
}

export default function StoreEditForm({ store }: StoreEditFormProps) {
  // Hooks de estado y navegación
  const router = useRouter();

  const [name, setName] = useState(store.name || "");
  const [description, setDescription] = useState(store.description || "");
  const [imageUrl, setImageUrl] = useState(store.image || "");

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasError = (fieldName: string) =>
    errors.some((e) => e.toLowerCase().includes(fieldName));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/store/${store.id}`, {
        method: "PUT",
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
        setErrors(data.errors || ["Error desconocido"]);
        setIsSubmitting(false);
        return;
      }

      router.push(`/stores/${store.id}`);
      router.refresh();
    } catch {
      setErrors(["Error de red, intenta de nuevo"]);
      setIsSubmitting(false);
    }
  };

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
        <label htmlFor="name" className="label">
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
        <label htmlFor="description" className="label">
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

      {/* Imagen */}
      <div className="form-control">
        <label htmlFor="imageUrl" className="label">
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

      {/* Botones */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => router.push(`/stores/me`)}
          className="btn btn-ghost flex-1"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`btn btn-primary flex-1 flex justify-center items-center gap-2 ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          <span>Guardar</span>
          <FaSave />
        </button>
      </div>
    </form>
  );
}
