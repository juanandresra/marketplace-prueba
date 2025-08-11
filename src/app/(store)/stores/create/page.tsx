// Página de creación de tienda
// Orquesta el formulario de creación usando Atomic Design y DaisyUI
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import StoreCreateForm from "@/components/organisms/StoreCreateForm";

export default async function CreateStorePage() {
  // Obtener sesión de usuario y redirigir si no está autenticado
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  return (
  // Render principal de la página de creación
    <div className="p-4 space-y-10">
      <div className="card bg-base-100 shadow-md rounded-xl p-8">
        <div className="card-body items-center text-center space-y-4">
          <h1 className="card-title text-2xl md:text-3xl font-bold">Crear Tienda</h1>
          <p className="text-base-content/70">Completa el formulario para registrar una nueva tienda en tu cuenta.</p>
          <StoreCreateForm />
        </div>
      </div>
    </div>
  );
}
