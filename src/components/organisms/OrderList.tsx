// OrderList.tsx
import { Order, OrderItem, Product } from "@prisma/client";
import OrderCard from "../molecules/OrderCard";

type OrderListProps = {
  orders: (Order & { items: (OrderItem & { product: Product })[] })[];
};

export default function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <p className="text-gray-500">No hay órdenes para esta tienda.</p>;
  }

  return (
    <ul className="space-y-4 w-full">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
}
