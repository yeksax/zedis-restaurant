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

const ADMIN_USER_ID = "user_2whm0gAigcVrbmpUnSfXZ5G5OP7";

export async function Header() {
  const user = await auth();
  const isAdmin = user.userId === ADMIN_USER_ID;

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] fixed top-0 left-0 right-0 z-10 bg-background items-center gap-4 h-16 w-full px-8">
      <div className="flex gap-4 font-serif text-3xl">
        <Link href="/">
          <h1>Zedis</h1>
        </Link>
      </div>

      <div className="flex gap-4">
        <Navigation isAdmin={isAdmin} />
      </div>

      <div className="flex gap-4 justify-end items-center">
        <CartButton />
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton showName />
        </SignedIn>
      </div>
    </header>
  );
}
