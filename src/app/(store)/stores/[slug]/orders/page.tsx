// Página de órdenes de una tienda
// Orquesta la vista de órdenes usando Atomic Design y DaisyUI
import prisma from "@/lib/prisma";
import { FaTicket } from "react-icons/fa6";
import OrderList from "@/components/organisms/OrderList";
import PageTemplate from "@/components/templates/PageTemplate";
import TextLabel from "@/components/atoms/TextLabel";
import { notFound } from "next/navigation";

export default async function StoreOrdersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const store = await prisma.store.findUnique({
    where: { id: slug },
    include: { business: true },
  });

  if (!store) notFound();

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: { storeId: store?.id },
        },
      },
    },
    include: {
      items: {
  where: { product: { storeId: store?.id } },
        include: {
          product: { include: { store: true } },
        },
      },
      client: true,
    },
  });

  return (
    <PageTemplate>
      <div className="mb-6 flex items-center gap-4">
        <FaTicket className="size-6 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold">Órdenes de la tienda</h1>
        <TextLabel>Panel de administración de órdenes</TextLabel>
      </div>
      <OrderList
        orders={orders.map((order) => ({
          id: order.id,
          clientId: order.clientId,
          createdAt: order.createdAt,
          items: order.items.map((item) => ({
            id: item.id,
            orderId: item.orderId, // ← lo agregas
            productId: item.productId, // ← lo agregas
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            product: item.product,
          })),
        }))}
      />
    </PageTemplate>
  );
}
