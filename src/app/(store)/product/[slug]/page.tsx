import prisma from "@/lib/prisma";
import ProductDetails from "@/components/organisms/ProductDetails";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = await prisma.product.findUnique({
    where: { id: (await params).slug },
    include: { store: true },
  });

  if (!product) {
    notFound(); // Redirige a la página 404
  }

  return (
    <div className="p-4 space-y-10">
      <div className="card bg-base-100 shadow-md rounded-xl p-6">
        <div className="card-body">
          <ProductDetails product={product} />
        </div>
      </div>
    </div>
  );
}
