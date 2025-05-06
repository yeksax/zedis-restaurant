import { server_getMenuItems } from "@/actions/menu-actions";
import { MenuPage } from "./menu-page";

export default async function Page() {
  const { items, nextCursor } = await server_getMenuItems();
  return <MenuPage initialItems={items} initialNextCursor={nextCursor} />;
}
