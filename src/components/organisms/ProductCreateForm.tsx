// Organism: Formulario de creación de producto
// Permite crear un nuevo producto para una tienda
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCreateFormProps {
  storeId: string;
}

export default function ProductCreateForm({ storeId }: ProductCreateFormProps) {
  // Hooks de estado y navegación
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      title: formData.get("title") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      storeId,
    };

    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
  // ...existing code...

    setLoading(false);

    if (res.ok) {
      router.push(`/stores/${storeId}`);
    } else {
      alert("Error al crear el producto");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-100 w-full shadow-md rounded-xl p-8 space-y-6"
    >
      {/* Nombre */}
      <div className="form-control">
        <label htmlFor="title" className="label font-semibold mb-2">
          <span className="label-text">Nombre</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Ej: Camiseta de algodón"
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Precio */}
      <div className="form-control">
        <label htmlFor="price" className="label font-semibold mb-2">
          <span className="label-text">Precio</span>
        </label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Ej: 19.99"
          className="input input-bordered w-full"
          step="0.01"
          required
        />
      </div>

      {/* Descripción */}
      <div className="form-control">
        <label htmlFor="description" className="label font-semibold mb-2">
          <span className="label-text">Descripción</span>
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe el producto..."
          className="textarea textarea-bordered w-full"
          rows={4}
          required
        ></textarea>
      </div>

      {/* Imagen */}
      <div className="form-control">
        <label htmlFor="image" className="label font-semibold mb-2">
          <span className="label-text">Imagen (URL)</span>
        </label>
        <input
          type="url"
          id="image"
          name="image"
          placeholder="https://ejemplo.com/imagen.jpg"
          className="input input-bordered w-full"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => router.push(`/stores/${storeId}`)}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Producto"}
        </button>
      </div>
    </form>
  );
}
