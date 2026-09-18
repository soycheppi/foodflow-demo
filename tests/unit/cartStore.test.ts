import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import { useCartStore, useCart } from '@/features/cart/useCartStore';
import { CartProvider } from '@/features/cart/CartProvider';
import { Product } from '@/core/types/catalog';

describe('useCartStore (Zustand State Engine)', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().vaciarCarrito();
  });

  const sampleProduct: Product = {
    id: 'prod-burger-1',
    nombre: 'Burger Special',
    descripcion: 'Signature beef burger',
    precio: 1200,
    stock: 15,
    categoria: 'cat-burgers',
    imagenUrl: '',
    orden: 1,
    permiteReserva: false,
  };

  it('starts with an empty cart', () => {
    const state = useCartStore.getState();
    expect(state.articulos).toEqual([]);
    expect(state.totalArticulos()).toBe(0);
    expect(state.totalCarrito()).toBe(0);
  });

  it('adds items to the cart and calculates quantity and total', () => {
    const store = useCartStore.getState();
    store.agregarAlCarrito(sampleProduct);

    let state = useCartStore.getState();
    expect(state.articulos.length).toBe(1);
    expect(state.articulos[0].cantidad).toBe(1);
    expect(state.totalArticulos()).toBe(1);
    expect(state.totalCarrito()).toBe(1200);

    // Adding the same item increments quantity
    store.agregarAlCarrito({ ...sampleProduct, cantidad: 2 });
    state = useCartStore.getState();
    expect(state.articulos.length).toBe(1);
    expect(state.articulos[0].cantidad).toBe(3);
    expect(state.totalArticulos()).toBe(3);
    expect(state.totalCarrito()).toBe(3600);
  });

  it('decrements item quantity and removes it when reaching 0', () => {
    const store = useCartStore.getState();
    store.agregarAlCarrito({ ...sampleProduct, cantidad: 2 });

    store.removerDelCarrito(sampleProduct.id);
    let state = useCartStore.getState();
    expect(state.articulos[0].cantidad).toBe(1);

    store.removerDelCarrito(sampleProduct.id);
    state = useCartStore.getState();
    expect(state.articulos.length).toBe(0);
    expect(state.totalArticulos()).toBe(0);

    // Removing a non-existent item should safely no-op
    store.removerDelCarrito('non-existent-id');
    expect(useCartStore.getState().articulos.length).toBe(0);
  });

  it('removes a product completely with eliminarProducto and resets on vaciarCarrito', () => {
    const store = useCartStore.getState();
    store.agregarAlCarrito({ ...sampleProduct, cantidad: 5 });
    store.eliminarProducto(sampleProduct.id);

    expect(useCartStore.getState().articulos.length).toBe(0);

    store.agregarAlCarrito({ ...sampleProduct, id: 'prod-soda', precio: 300 });
    store.agregarAlCarrito({ ...sampleProduct, id: 'prod-fries', precio: 500 });
    expect(useCartStore.getState().articulos.length).toBe(2);

    store.vaciarCarrito();
    expect(useCartStore.getState().articulos.length).toBe(0);
    expect(useCartStore.getState().totalCarrito()).toBe(0);
  });

  it('exposes convenience properties via useCart hook and renders CartProvider wrapper', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.totalArticulos).toBe(0);
    expect(result.current.totalCarrito).toBe(0);

    const { container } = render(
      React.createElement(CartProvider, null, React.createElement('div', null, 'Cart Child'))
    );
    expect(container.textContent).toBe('Cart Child');
  });
});
