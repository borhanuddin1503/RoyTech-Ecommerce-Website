"use client";

import Actions from "./Actions";
import ColorSelector from "./ColorSelector";
import ProductProvider from "./ProductProvider";
import QuantitySelector from "./QuantitySelectors";
import SizeSelector from "./SizeSelector";


export default function ProductClient({ product }) {
  return (
    <ProductProvider product={product}>
      <ColorSelector />
      <SizeSelector/>
      <QuantitySelector></QuantitySelector>
      <Actions></Actions>
    </ProductProvider>
  );
}
