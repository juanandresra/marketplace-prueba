// Organism: Formulario de edición de producto
// Permite editar los datos de un producto existente
// components/organisms/ProductEditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave } from "react-icons/fa";
import { Product } from "@prisma/client";

interface ProductEditFormProps {
  product: Product;
}

export default function ProductEditForm({ product }: ProductEditFormProps) {
  // Hooks de estado y navegación
  const router = useRouter();

  const [title, setTitle] = useState(product.title || "");
  const [description, setDescription] = useState(product.description || "");
  const [imageUrl, setImageUrl] = useState(product.image || "");
  const [price, setPrice] = useState(product.price.toString());

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasError = (fieldName: string) =>
    errors.some((e) => e.toLowerCase().includes(fieldName));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          image: imageUrl,
          price: Number(price),
        }),
      });
  // ...existing code...

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ["Error desconocido"]);
        setIsSubmitting(false);
        return;
      }

      router.push(`/product/${product.id}`);
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

      {/* Título */}
      <div className="form-control">
        <label htmlFor="title" className="label">
          <span className="label-text">Título</span>
        </label>
        <input
          type="text"
          id="title"
          className={`input input-bordered w-full ${
            hasError("title") ? "input-error" : ""
          }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {hasError("title") && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.find((e) => e.toLowerCase().includes("title"))}
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
          className={`textarea textarea-bordered w-full ${
            hasError("description") ? "input-error" : ""
          }`}
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
          className={`input input-bordered w-full ${
            hasError("image") ? "input-error" : ""
          }`}
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

      {/* Precio */}
      <div className="form-control">
        <label htmlFor="price" className="label">
          <span className="label-text">Precio</span>
        </label>
        <input
          type="number"
          id="price"
          className={`input input-bordered w-full ${
            hasError("price") ? "input-error" : ""
          }`}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
          required
          disabled={isSubmitting}
        />
        {hasError("price") && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.find((e) => e.toLowerCase().includes("price"))}
            </span>
          </label>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => router.push(`/product/${product.id}`)}
          className="btn btn-ghost flex-1"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary flex-1 flex justify-center items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting && <span className="loading loading-spinner"></span>}
          Guardar cambios
          <FaSave />
        </button>
      </div>
    </form>
  );
}
