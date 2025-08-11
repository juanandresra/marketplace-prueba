
// Organism: Detalle de producto
// Muestra información de un producto y permite agregarlo al carrito
'use client';

import { Product, Store } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa";
import { QuantitySelector } from "../molecules/QuantitySelector";
import { useState } from "react";
import { useCartStore } from "@/store/cart/cart-store";

interface ProductWithStore extends Product {
  store?: Store;
}

interface ProductDetailsProps {
  product: ProductWithStore;
  currentStoreId?: string; // 👈 ID de la tienda actual
  editable?: boolean;
  onAddToCart?: (product: ProductWithStore) => void;
}

export default function ProductDetails({
  product,
  currentStoreId,
  editable = false,
}: ProductDetailsProps) {
  // Hook para agregar al carrito
  const { addToCart } = useCartStore();
  // Estado para cantidad
  const [quantity, setQuantity] = useState<number>(1);

  // Handler para agregar producto al carrito
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      slug: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.image || '',
      storeId: product.store?.id,
      storeName: product.store?.name,
    });
  };

  // Render de la card de producto
  return (
    <div className="card bg-base-100 shadow-md rounded-xl hover:shadow-lg transition">
      {product.image && (
        <figure>
          <Image
            src={product.image}
            alt={product.title}
            width={500}
            height={300}
            className="w-full h-48 object-cover"
          />
        </figure>
      )}
      <div className="card-body space-y-2">
        <Link href={`/product/${product.id}`} className="card-title text-lg font-bold hover:text-primary transition-colors">
          {product.title}
        </Link>
        <p className="text-gray-700 font-semibold">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description}
        </p>

        {/* Mostrar "Ver tienda" solo si no estamos en la misma tienda */}
        {product.store && product.store.id !== currentStoreId && (
          <Link
            href={`/stores/${product.store.id}`}
            className="text-blue-500 hover:underline text-sm mt-2"
          >
            Ver tienda
          </Link>
        )}

        { editable ? (
        <Link
            href={`/product/${product.id}/edit`}
            className="btn btn-primary btn-sm"
          >
            Editar producto
          </Link>
        ) : (
          

        
        <div className="flex flex-row items-center justify-between mt-2">
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
          />

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-sm flex items-center gap-2"
          >
            <FaCartPlus className="text-lg" />
            Agregar al carrito
          </button>
        </div>
        )}
      </div>
      
    </div>
  );
}
