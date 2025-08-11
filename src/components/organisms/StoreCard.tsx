// Organism: Card de tienda
// Muestra información básica de una tienda

// Organism: Card de tienda
// Muestra información básica de una tienda
'use client';

import { Store } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailsProps {
  store: Store;
}

export default function ProductDetails({
  store
}: ProductDetailsProps) {
  // Render de la card de tienda
  return (
    <div className="card bg-base-100 shadow-md rounded-xl hover:shadow-lg transition">
      {store.image && (
        <figure>
          <Image
            src={store.image}
            alt={store.name}
            width={500}
            height={300}
            className="w-full h-48 object-cover"
          />
        </figure>
      )}
      <div className="card-body space-y-2">
        <Link href={`/stores/${store.id}`} className="card-title text-lg font-bold hover:text-primary transition-colors">
          {store.name}
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2">
          {store.description}
        </p>
        <div className="card-actions justify-end mt-2">
          <Link
            href={`/stores/${store.id}`}
            className="btn btn-outline btn-sm"
          >
            Ver tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
