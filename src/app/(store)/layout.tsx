import { NavBar } from "@/components/organisms/NavBar";
import { Footer } from "@/components/organisms/Footer";
import { Providers } from "@/components/Providers";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Providers>
        <NavBar />
        <div className="overflow-auto flex flex-col flex-1">{children}</div>
        <Footer />
      </Providers>
    </>
  );
}
