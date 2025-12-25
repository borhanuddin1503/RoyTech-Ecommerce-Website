
import Link from 'next/link';
import Image from 'next/image';

const CategoriesSection = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories?limit=12`, {
        next: { tags: ['categories'], revalidate: 3600}
    });
    const categories = await res.json();

    return (
        <section className="max-w-7xl mx-auto px-4 mt-13">
            {/* Section Header */}
            <div className="text-center mb-7">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    Shop by Category
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Discover products from our wide range of categories
                </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
                {categories.map((category) => (
                    <Link
                        key={category._id}
                        href={`/products?category=${category?.name}`}
                        className="group h-full"
                    >
                        <div className="bg-white h-full rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-lg hover:border-main transition-all duration-300 transform group-hover:-translate-y-2 text-center">
                            {/* Category Icon */}
                            <div className="relative h-16 mx-auto mb-3">
                                <Image
                                    src={category.icon}
                                    alt={category.name}
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>

                            {/* Category Name */}
                            <h3 className="font-semibold text-gray-800 group-hover:text-main transition-colors duration-200 text-sm leading-tight">
                                {category.name}
                            </h3>


                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;