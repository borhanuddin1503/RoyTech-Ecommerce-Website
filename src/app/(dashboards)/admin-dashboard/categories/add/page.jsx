import AddCategoryForm from "../../components/AddCategoryForm";




export default async function AddCategoryPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
        next: { tags: ['categories'], revalidate: 3600 }
    });
    const categories = await res.json();

    return <AddCategoryForm initialCategories={categories} />;
}