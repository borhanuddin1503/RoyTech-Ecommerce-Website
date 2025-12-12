"use client";
import useProducts from "@/app/customHooks/useProducts";

export default function ColorSelector() {
    const { product, selectedColor, setSelectedColor } = useProducts();

    return (
        <div>
            {product.availableColors && product.availableColors.length > 0 && <div>
                <h2 className="text-lg font-semibold mb-3">Available Colors</h2>
                <div className="flex gap-2">
                    {product.availableColors.map(color => (
                        <div
                            key={color}
                            className={`w-8 h-8 rounded-full  cursor-pointer border border-gray-300 ${selectedColor === color ? "border-2 border-main" : ""
                                }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                        />
                    ))}
                </div>
            </div>}
        </div>
    );
}
