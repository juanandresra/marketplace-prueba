// Página de creación de producto
// Orquesta el formulario de creación usando Atomic Design y DaisyUI
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/organisms/ProductCreateForm";
import { authOptions } from "@/lib/auth";

export default async function CreateProductPage({
  // Obtener sesión, tienda y verificar permisos
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Verificar si la tienda existe y pertenece al usuario
  const store = await prisma.store.findUnique({
    where: { id: (await params).slug },
    include: { business: true },
  });

  if (!store) {
    redirect("/"); // Tienda no encontrada
  }

  if (store.business.email !== session.user.email) {
    redirect(`/stores/${store.id}`); // No es el dueño
  }

  return (
  // Render principal de la página de creación de producto
    <div className="p-4 space-y-10">
      <div className="card bg-base-100 shadow-md rounded-xl p-8">
        <div className="card-body items-center text-center space-y-4">
          <h1 className="card-title text-2xl md:text-3xl font-bold">Crear Producto</h1>
          <p className="text-base-content/70">Añade un nuevo producto para tu tienda <span className="font-semibold">{store.name}</span></p>
          <ProductForm storeId={store.id} />
        </div>
      </div>
    </div>
  );
}
