import { Header } from "@/components/header";
import { CartProvider } from "@/contexts/cart-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <div className="pt-20">{children}</div>
    </CartProvider>
  );
}
