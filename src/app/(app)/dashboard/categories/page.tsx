import { server_getCategories } from "@/actions/category-actions";
import { CategoriesPage } from "./categories-page";

export default async function Categories() {
  const categories = await server_getCategories();

  return (
    <div className="grid grid-cols-[1.5fr_1fr] gap-12">
      <CategoriesPage categories={categories} />
    </div>
  );
}
