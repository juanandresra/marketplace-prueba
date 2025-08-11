// OrderCard.tsx
// Molécula: Tarjeta para mostrar información de una orden individual

import { Order, OrderItem, Product } from "@prisma/client";

interface OrderCardProps {
  order: Order & { items: (OrderItem & { product: Product })[] };
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <li className="card bg-base-100 shadow-md rounded-xl w-full">
      <div className="card-body space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="card-title text-lg font-bold">Orden #{order.id}</h2>
          {/* <span className="badge badge-info capitalize">{order.status}</span> */}
        </div>

        <h3 className="font-semibold mb-1">Productos:</h3>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.product.title} — {item.quantity} × ${item.unitPrice} - {item.product.storeId}
            </li>
          ))}
        </ul>

        <p className="text-sm text-gray-400">
          Fecha: {new Date(order.createdAt).toLocaleDateString("es-ES")}
        </p>
      </div>
    </li>
  );
}
