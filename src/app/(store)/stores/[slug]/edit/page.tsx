// Página de edición de tienda
// Orquesta el formulario de edición usando Atomic Design y DaisyUI
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import StoreEditForm from "@/components/organisms/StoreEditForm";
import { authOptions } from "@/lib/auth";

export default async function EditStorePage({
  // Obtener sesión, tienda y verificar permisos
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  // Buscar la tienda
  const store = await prisma.store.findUnique({
    where: { id: (await params).slug },
    include: { business: true },
  });

  if (!store) {
    redirect("/"); // Tienda no encontrada
  }

  // Verificar que el usuario sea el dueño
  if (store.business.email !== session.user.email) {
    redirect(`/store/${store.id}`);
  }

  return (
  // Render principal de la página de edición de tienda
    <div className="p-4 space-y-10">
      <div className="card bg-base-100 shadow-md rounded-xl p-8">
        <div className="card-body items-center text-center space-y-4">
          <h1 className="card-title text-2xl md:text-3xl font-bold">Editar Tienda</h1>
          <p className="text-base-content/70">
            Modifica los datos de tu tienda{" "}
            <span className="font-semibold">{store.name}</span>.
          </p>
        </div>
        <StoreEditForm store={store} />
      </div>
    </div>
  );
}
