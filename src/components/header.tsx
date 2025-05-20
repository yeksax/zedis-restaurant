import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Navigation } from "./navigation";
import { CartButton } from "./cart/cart-button";
import { Button } from "./ui/button";
import { server_getAdmin } from "@/actions/admin-management-actions";

export async function Header() {
  const adminPermission = await server_getAdmin();

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] fixed top-0 left-0 right-0 z-10 bg-background items-center gap-4 h-16 w-full px-8">
      <div className="flex gap-4 font-serif text-3xl">
        <Link href="/">
          <h1>Zedis</h1>
        </Link>
      </div>

      <div className="flex gap-4">
        <Navigation adminPermission={adminPermission} />
      </div>

      <div className="flex gap-4 justify-end items-center">
        <SignedOut>
          <Button variant="outline" size="sm" asChild>
            <SignInButton>Fazer Login</SignInButton>
          </Button>
          <Button size="sm" asChild>
            <SignUpButton>Fazer Cadastro</SignUpButton>
          </Button>
        </SignedOut>
        <SignedIn>
          <CartButton />
          <UserButton showName />
        </SignedIn>
      </div>
    </header>
  );
}
