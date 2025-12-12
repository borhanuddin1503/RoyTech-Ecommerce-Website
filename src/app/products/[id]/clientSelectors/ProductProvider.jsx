'use client'
import React, { createContext, useContext, useState } from 'react'
export const ProductContext = createContext();

export default function ProductProvider({ children, product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <ProductContext.Provider
      value={
        { selectedColor, setSelectedColor, selectedSize, setSelectedSize, product ,quantity , setQuantity , increaseQty , decreaseQty }
      }
    >
      {children}
    </ProductContext.Provider>
  )
}
