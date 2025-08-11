import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductEditForm from "@/components/organisms/ProductEditForm";
import { authOptions } from "@/lib/auth";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const { slug } = await params;

  console.log(slug);

  const product = await prisma.product.findUnique({
    where: { id: slug },
    include: { store: true },
  });

  if (!product) {
    redirect("/"); // Producto no encontrado
  }

  if (product.store.businessId !== session.user.id) {
    redirect(`/product/${product.id}`);
  }

  return (
    <div className="p-4 space-y-10">
      {product && (
        <div className="card bg-base-100 shadow-md rounded-xl p-8">
          <div className="card-body items-center text-center space-y-4">
            <h1 className="card-title text-2xl md:text-3xl font-bold">Editar Producto</h1>
            <p className="text-base-content/70 mt-2">
              Modifica los datos de tu producto{" "}
              <span className="font-semibold">{product.title}</span>.
            </p>
          </div>
          <ProductEditForm product={product} />
        </div>
      )}
    </div>
  );
}
