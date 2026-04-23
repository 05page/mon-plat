import React, { createContext, useContext, useState } from 'react';
import { Foods } from '@/types/foods';

type CartItem = Foods & { quantity: number };

type CartContextType = {
    cart: CartItem[];
    addToCart: (food: Foods) => void;
    removeFromCart: (title: string) => void;
    total: number;
};
const CartContext = createContext<CartContextType>({} as CartContextType);

export default function CartProvider({ children }: { children: React.ReactNode }){
    const [cart, setCart] = useState<CartItem[]>([]);
    const addToCart = (food: Foods) => {
        setCart(prev => {
            const existing = prev.find(item => item.title === food.title)
            if (existing) {
                // ✅ Article déjà dans le panier → augmente la quantité
                return prev.map(item =>
                    item.title === food.title
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...food, quantity: 1 }];
        })
    }
    const removeFromCart = (title: string) => {
        setCart(prev => prev.filter(item => item.title !== title));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, total }}>
            {children}
        </CartContext.Provider>
    );
}
export const useCart = () => useContext(CartContext);