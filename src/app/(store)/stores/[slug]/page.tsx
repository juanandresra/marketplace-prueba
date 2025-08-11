// Página de tienda individual
// Orquesta la vista de una tienda específica usando Atomic Design y DaisyUI
import prisma from "@/lib/prisma";
import ProductDetails from "@/components/organisms/ProductDetails";
import Link from "next/link";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { FaCashRegister, FaPlus, FaUser } from "react-icons/fa";
import { FaTicket } from "react-icons/fa6";
import { authOptions } from "@/lib/auth";

export default async function Page({
  // Obtener slug de la tienda y sesión de usuario
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const pageSize = 6;
  const currentPage = parseInt((await searchParams).page || "1", 10);
  const skip = (currentPage - 1) * pageSize;

  const store = await prisma.store.findUnique({
    where: { id: slug },
    include: { business: true },
  });

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where: { storeId: slug },
      include: { store: true },
      skip,
      take: pageSize,
    }),
    prisma.product.count({
      where: { storeId: slug },
    }),
  ]);

  if (!store) {
    return <p className="p-4">Tienda no encontrada</p>;
  }

  const totalPages = Math.ceil(totalProducts / pageSize);
  const isOwner =
    session?.user?.email && session.user.email === store.business?.email;

  return (
  // Render principal de la tienda
    <div className="space-y-4">
      {/* Hero / Cabecera */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
        {store.image ? (
          <Image
            src={store.image}
            alt={store.name}
            fill
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Sin imagen de cabecera
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {store.name}
          </h1>
          {store.description && (
            <p className="mt-3 max-w-2xl text-gray-200">{store.description}</p>
          )}
          <p className="mt-3 max-w-2xl flex gap-2 items-center text-gray-200">
            <FaUser className="inline" />
            <span>
              {store.business.name} ({store.business.email})
            </span>
          </p>
          {isOwner && (
            <div className="flex gap-4">
            <Link
              href={`/stores/${slug}/create-product`}
              className="btn btn-primary mt-4"
            >
              <FaPlus className="inline" />
              Crear producto
            </Link>
            
            <Link
              href={`/stores/${slug}/orders`}
              className="btn btn-primary mt-4"
            >
              <FaTicket></FaTicket>
              <span>Ordenes</span>
            </Link>
            </div>
          )}
        </div>
      </div>

      {/* Lista de productos */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-4 mb-6 py-2">
          <FaCashRegister className="size-6" />
          <h3 className="text-2xl font-semibold">Productos</h3>
        </div>
        {products.length === 0 ? (
          <p className="text-gray-500">Esta tienda no tiene productos.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (                              
                <ProductDetails
                  key={product.id}
                  product={product}
                  currentStoreId={slug}
                  editable={product.store.businessId == session?.user?.id}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="join">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={`?page=${page}`}
                        className={`join-item btn btn-sm ${
                          page === currentPage ? "btn-active" : ""
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
