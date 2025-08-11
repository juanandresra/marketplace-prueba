// Organism: Barra de navegación principal
// Muestra enlaces y acciones principales del usuario
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { CartNavBar } from "../molecules/CartNavBar";

export const NavBar = async () => {
  // Obtener sesión de usuario para mostrar avatar y acciones
  const session = await getServerSession(authOptions);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          MarketPlace
        </Link>
      </div>
      <div className="flex-none flex gap-3">
        <CartNavBar />
        {session?.user ? (
          <>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                {session?.user?.image && (
                  <div className="w-10 rounded-full">
                    <Image
                      alt="User Avatar"
                      src={session.user.image}
                      width={40}
                      height={40}
                    />
                  </div>
                )}
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li className="border-b-[0.5px] border-gray-400 dark:border-gray-700 mb-2 !bg-transparent focus:bg-transparent active:bg-transparent">
                  <div className="hover:bg-transparent hover:shadow-none flex flex-col items-start py-2">
                    <span>{session.user?.name}</span>
                    <span className="text-xs text-gray-200 dark:text-gray-400">
                      {session.user?.email}
                    </span>
                    {/* <span className="text-xs text-gray-200 dark:text-gray-400">
                      {session.user?.roles?.join(", ")}
                    </span> */}
                  </div>
                </li>
                {session.user?.roles?.includes("BUSINESS") && (
                  <li>
                    <Link href="/stores/me">Tiendas</Link>
                  </li>
                )}
                <li>
                  <Link href="/orders">Mis pedidos</Link>
                </li>
                <li>
                  <Link href="/api/auth/signout">Cerrar sesión</Link>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/api/auth/signin" className="btn btn-primary">
            Iniciar sesión
          </Link>
        )}
      </div>
    </div>
  );
};
