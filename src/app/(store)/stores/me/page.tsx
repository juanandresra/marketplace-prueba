import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import DeleteStoreButton from "@/components/organisms/DeleteStoreButton";
import PageTemplate from "@/components/templates/PageTemplate";
import TextLabel from "@/components/atoms/TextLabel";

export default async function StoresPage() {
  const session = await getServerSession();
  const stores = await prisma.store.findMany({
    where: {
      business: {
        email: session?.user?.email,
      },
    },
    include: {
      products: true,
      business: true,
    }
  });

  // Página de "Mis tiendas"
  // Orquesta la vista usando Atomic Design: Template, Organisms, Molecules, Atoms
  // DaisyUI para estilos visuales consistentes
  // Página de mis tiendas (Atomic Design: solo orquesta)
  return (
    <PageTemplate>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Tiendas</h1>
        <TextLabel>Panel de gestión de tus tiendas</TextLabel>
        <Link href="/stores/create" className="btn btn-primary">
          Crear Tienda
        </Link>
      </div>

      {stores.length === 0 && (
        <TextLabel>No tienes tiendas registradas.</TextLabel>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="card bg-base-100 shadow-md rounded-xl">
            {store.image && (
              <figure>
                <Image
                  src={store.image}
                  alt={store.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </figure>
            )}
            <div className="card-body space-y-2">
              <h2 className="card-title text-lg font-bold">{store.name}</h2>
              {store.description && (
                <TextLabel className="text-sm">{store.description}</TextLabel>
              )}
              <TextLabel className="text-xs text-gray-400">
                {store.products.length} productos
              </TextLabel>
              <div className="card-actions justify-end mt-4">
                <Link
                  href={`/stores/${store.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Ver tienda
                </Link>
                <Link
                  href={`/stores/${store.id}/orders`}
                  className="btn btn-primary btn-sm"
                >
                  Ordenes
                </Link>
                <Link
                  href={`/stores/${store.id}/edit`}
                  className="btn btn-secondary btn-sm"
                >
                  Editar
                </Link>
                <DeleteStoreButton storeId={store.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageTemplate>
  );
}
