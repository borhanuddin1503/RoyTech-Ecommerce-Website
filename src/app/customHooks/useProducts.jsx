'use client'
import React, { useContext } from 'react'
import { ProductContext } from '../products/[id]/clientSelectors/ProductProvider'

export default function useProducts() {
    const products = useContext(ProductContext);
    return products
}
