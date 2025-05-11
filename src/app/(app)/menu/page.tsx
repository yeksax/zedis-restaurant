import { server_getCategories } from "@/actions/category-actions";
import { redirect } from "next/navigation";

export default async function MenuPage() {
  const categories = await server_getCategories();
  redirect(`/menu/${categories[0].slug}`);
}
