import { CategoryForm } from "../category-form";

export default function NovaCategoriaPage() {
  return (
    <div>
      <h1 className="text-2xl">Nova categoria</h1>
      <div className="mt-6">
        <CategoryForm />
      </div>
    </div>
  );
}
