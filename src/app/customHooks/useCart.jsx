"use client";
import { useEffect, useState } from "react";

export default function useCart() {
    const [cart, setCart] = useState([]);

    // load cart on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const items = JSON.parse(localStorage.getItem("cart")) || [];
                setCart(items);
            } catch {
                setCart([]);
            }
        }
    }, []);

    // listen for storage updates (UPDATES UI instantly)
    useEffect(() => {
        const syncCart = () => {
            const items = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(items);
        };

        window.addEventListener("storage", syncCart);
        return () => window.removeEventListener("storage", syncCart);
    }, []);

    const addToCart = (product) => {
        const newCart = [...cart, product];
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));

        // trigger manual sync for same tab
        window.dispatchEvent(new Event("storage"));
    };

    const deleteFromCart = (product) => {
        const newCart = cart.filter((c) => product !== c);
        setCart(newCart);
        localStorage.setItem("cart" , JSON.stringify(newCart))

        window.dispatchEvent(new Event("storage"));
    }

    return { cart, addToCart , deleteFromCart };
}


