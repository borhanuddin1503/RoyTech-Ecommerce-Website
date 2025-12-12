import CheckoutSummary from "./CheckoutSummary";

export default async function PaymentPage({ searchParams }) {
  const searchdParams = await searchParams;
  const itemsParam = searchdParams.products

  // localStorage data এর proxy হিসাবে URL query
  const checkoutItems = itemsParam
    ? JSON.parse(decodeURIComponent(itemsParam))
    : [];

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-main mb-6">Payment Page</h1>
        <p className="text-gray-500">No items to pay for.</p>
      </div>
    );
  }

  console.log(checkoutItems)

  // -------------------------
  // 1. Server থেকে product data fetch
  const productIds = checkoutItems.map(item => item._id).join(",");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?ids=${productIds}`, { cache: "no-store" });
  const Response = await res.json();
  const products = await Response.products;

  console.log(products);

  // 2. Merge server data + user selected options
  const finalItems = checkoutItems.map(item => {
    const product = products.find(p => p._id === item._id);
    return {
      ...product,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      quantity: item.quantity
    };
  });

  console.log('final items' , finalItems)

  const totalPrice = finalItems.reduce((acc, item) => acc + (item.discountedPrice || item.price || 0) * item.quantity, 0);

  return (
    <div className="min-h-screen p-6 max-w-7xl px-4 mx-auto">
      <div className=" mx-auto bg-white shadow-lg rounded-2xl">
        <CheckoutSummary items={finalItems} total={totalPrice}></CheckoutSummary>
      </div>
    </div>
  );
}
