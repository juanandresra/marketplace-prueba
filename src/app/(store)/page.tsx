// Página principal del marketplace
// Orquesta la vista usando Atomic Design: Template, Organisms, Molecules, Atoms
// DaisyUI para estilos visuales consistentes
import ProductDetails from "@/components/organisms/ProductDetails";
import prisma from "@/lib/prisma";
import Link from "next/link";
import StoreCard from "@/components/organisms/StoreCard";
import { Store } from "@/types/prisma";
import { FaCashRegister, FaStore } from "react-icons/fa";
  // Obtener sesión de usuario (para saber si puede editar productos)
import { getServerSession } from "next-auth";
  // Obtener parámetros de búsqueda y paginación
import { authOptions } from "@/lib/auth";
import PageTemplate from "@/components/templates/PageTemplate";
import TextLabel from "@/components/atoms/TextLabel";

export default async function StorePage({
  searchParams,
}: {
  // Consultar productos y total de productos
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const sp = searchParams ? await searchParams : {};
  const pageSize = 12;
  const currentPage = parseInt(
    Array.isArray(sp.page) ? sp.page[0] : sp.page || "1",
    10
  );
  // Calcular total de páginas
  const skip = (currentPage - 1) * pageSize;
  // Obtener tiendas aleatorias para mostrar
  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      include: { store: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count(),
  ]);
  const totalPages = Math.ceil(totalProducts / pageSize);
  const randomStores = await prisma.$queryRaw`
    SELECT * FROM "stores"
    ORDER BY RANDOM()
    LIMIT 5
  ` as Store[];

  // Página principal de la tienda (Atomic Design: solo orquesta)
  return (
    <PageTemplate>
      {/* Sección de tiendas destacadas */}
      <div className="card bg-base-100 shadow-md rounded-xl mb-4">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <FaStore className="size-6 text-primary" />
            <h1 className="card-title text-2xl md:text-3xl font-bold">Algunas de nuestras tiendas</h1>
            <TextLabel>Explora tiendas destacadas</TextLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {randomStores.map((store) => (
              <StoreCard key={store.id} store={{
                id: store.id,
                name: store.name,
                description: store.description || '',
                image: store.image || '',
                businessId: store.businessId || '',
                createdAt: store.createdAt || '',
                updatedAt: store.updatedAt || '',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Sección de productos */}
      <div className="card bg-base-100 shadow-md rounded-xl">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <FaCashRegister className="size-6 text-secondary" />
            <h1 className="card-title text-2xl md:text-3xl font-bold">Últimos productos</h1>
            <TextLabel>Recién agregados</TextLabel>
          </div>
          {products.length === 0 ? (
            <TextLabel>No hay productos disponibles.</TextLabel>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {products.map((product) => (
                  <ProductDetails key={product.id} product={product}
                    editable={product.store.businessId == session?.user?.id} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="join">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Link
                          key={page}
                          href={`?page=${page}`}
                          className={`join-item btn btn-sm btn-outline ${page === currentPage ? "btn-primary" : ""}`}
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
    </PageTemplate>
  );
}
