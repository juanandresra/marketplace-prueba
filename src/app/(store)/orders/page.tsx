import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import PageTemplate from "@/components/templates/PageTemplate";
import { FaReceipt } from "react-icons/fa";
import Link from "next/link";

/**
 * Página de órdenes del usuario autenticado.
 * Muestra todas las órdenes realizadas por el cliente, con detalles de productos y cantidades.
 */
export default async function UserOrdersPage() {
	// Obtener sesión y usuario autenticado
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		// Si no está autenticado, mostrar mensaje
		return (
			<PageTemplate>
				<div className="alert alert-warning mt-10">
					Debes iniciar sesión para ver tus órdenes.
				</div>
			</PageTemplate>
		);
	}

	// Consultar órdenes del usuario, incluyendo productos y cantidades
	const orders = await prisma.order.findMany({
		where: { clientId: session.user.id },
		orderBy: { createdAt: "desc" },
		include: {
			items: {
				include: {
					product: {
						include: { store: true },
					},
				},
			},
		},
	});

	return (
		<PageTemplate>
			{/* Título de la página */}
			<div className="flex items-center gap-3 mb-8">
				<FaReceipt className="size-6 text-primary" />
				<h1 className="card-title text-2xl md:text-3xl font-bold">
					Mis órdenes
				</h1>
			</div>

			{/* Si no hay órdenes */}
			{orders.length === 0 && (
				<div className="alert alert-info">No has realizado ninguna orden aún.</div>
			)}

			{/* Listado de órdenes */}
			<div className="space-y-8">
				{orders.map((order) => (
					<div
						key={order.id}
						className="card bg-base-100 shadow-md rounded-xl"
					>
						<div className="card-body">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
								<span className="font-semibold">
									Orden #{order.id.slice(0, 8)}
								</span>
								<span className="text-xs text-gray-400">
									{new Date(order.createdAt).toLocaleString()}
								</span>
							</div>
							<div className="divider my-2" />
							<div className="overflow-x-auto">
								<table className="table table-zebra">
									<thead>
										<tr>
											<th>Producto</th>
											<th>Tienda</th>
											<th>Cantidad</th>
											<th>Precio unitario</th>
											<th>Total</th>
										</tr>
									</thead>
									<tbody>
										{order.items.map((item) => (
											<tr key={item.id}>
												<td>
													<div className="flex items-center gap-2">
														{item.product.image && (
															<img
																src={item.product.image}
																alt={item.product.title}
																className="w-10 h-10 object-cover rounded"
															/>
														)}
														<span>{item.product.title}</span>
													</div>
												</td>
												<td>
													<Link
														href={`/stores/${item.product.storeId}`}
														className="link link-primary"
													>
														{item.product.store?.name || "Tienda"}
													</Link>
												</td>
												<td>{item.quantity}</td>
												<td>${item.unitPrice.toFixed(2)}</td>
												<td>
													${(item.unitPrice * item.quantity).toFixed(2)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{/* Total de la orden */}
							<div className="flex justify-end mt-4">
								<span className="font-bold text-lg">
									Total: $
									{order.items
										.reduce(
											(acc, item) => acc + item.unitPrice * item.quantity,
											0
										)
										.toFixed(2)}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</PageTemplate>
	);
}
