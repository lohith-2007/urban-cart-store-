import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext();
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items]);

  const add = (product, qty = 1) => setItems((cur) => {
    const found = cur.find((i) => i.product._id === product._id);
    if (found) return cur.map((i) => i === found ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i);
    return [...cur, { product, qty }];
  });
  const setQty = (id, qty) => setItems((cur) => cur.map((i) => i.product._id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.product.stock)) } : i));
  const remove = (id) => setItems((cur) => cur.filter((i) => i.product._id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);

  return <Ctx.Provider value={{ items, add, setQty, remove, clear, count, total }}>{children}</Ctx.Provider>;
}
