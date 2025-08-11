
// Página de carrito de compras
// Orquesta la vista usando Atomic Design: Template, Organisms, Molecules, Atoms
// DaisyUI para estilos visuales consistentes
"use client";

import { useCartStore } from "@/store/cart/cart-store";
import { useState } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PageTemplate from "@/components/templates/PageTemplate";
import TextLabel from "@/components/atoms/TextLabel";

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  // Obtener sesión de usuario
  const session = useSession();

  // Obtener datos del carrito y funciones de actualización
  const cartItems = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateProductQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  // Calcular totales
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handler para finalizar compra
  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (cartItems.length === 0) throw new Error("El carrito está vacío");
      // Agrupar por tienda (solo soporta una tienda por orden en este ejemplo)
      const storeId = cartItems[0].storeId;
      const items = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price
      }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, items })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0] || "Error al crear la orden");
      clearCart();
      setSuccess("¡Compra realizada con éxito!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate>
      {/* Cabecera */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Carrito de compras</h1>
        <TextLabel>Revisa y edita tus productos antes de comprar</TextLabel>
      </div>

      {success && (
        <div className="alert alert-success mb-4">{success}</div>
      )}
      {error && (
        <div className="alert alert-error mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos (Molecule/Card) */}
        {cartItems.length === 0 ? (
          <div className="lg:col-span-3 space-y-4">
            <div className="text-center bg-base-200 rounded-lg flex flex-col p-4">
              <TextLabel className="text-lg font-semibold">Tu carrito está vacío</TextLabel>
              <Link href="/" className="btn btn-primary mt-4">
                Seguir comprando
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="card card-side bg-base-100 shadow-md rounded-xl border border-base-300"
              >
                {item.image && (
                  <figure className="w-44 h-44 relative shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-l-lg"
                    />
                  </figure>
                )}
                <div className="card-body p-4 space-y-2">
                  <h2 className="card-title text-lg font-bold">{item.title}</h2>
                  <TextLabel className="text-sm">${item.price.toFixed(2)}</TextLabel>
                  <Link
                    href={`/stores/${item.storeId}`}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Tienda: {item.storeName}
                  </Link>

                  {/* Contenedor de acciones: selector cantidad a la izquierda, eliminar a la derecha */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Selector de cantidad (Atom) */}
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(item.quantity - 1, 1)
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline btn-success"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Botón eliminar (Atom) */}
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Eliminar ${item.title} del carrito`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen del pedido (Molecule/Card) */}
        {cartItems.length > 0 && (
          <div className="card bg-base-100 shadow-md border border-base-300 p-4 h-fit">
            <h2 className="text-lg font-semibold mb-4">Resumen de compra</h2>

            <div className="flex justify-between text-sm mb-2">
              <span>Cantidad de artículos</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Envío</span>
              <span>Gratis</span>
            </div>

            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {session.status == "unauthenticated" ? (
              <div className="alert alert-warning mt-4 text-center flex justify-center">
                <TextLabel>Debes iniciar sesión para hacer finalizar compra.</TextLabel>
              </div>
            ) : (
              <button
                className="btn btn-primary w-full mt-4"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Finalizar compra"}
              </button>

            )}
          </div>
        )}
      </div>
    </PageTemplate>
  );
}
