import { Category } from "@prisma/client";
import { getCategories } from "./actions";
import CategorieAdminPages from "./categorie.admin";

export default async function CategorieAdmin() {
  const categories = await getCategories();
  return <CategorieAdminPages items={categories as Category[]} />;
}
