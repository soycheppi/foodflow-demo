import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/core/types/catalog';
import type { CartItem } from '@/core/types/order';
import { calculateSubtotal } from '@/core/logic/pricing';

interface CartState {
  articulos: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  setItems: (articulos: CartItem[]) => void;
  agregarAlCarrito: (producto: Product & { cantidad?: number }) => void;
  removerDelCarrito: (id: string) => void;
  eliminarProducto: (id: string) => void;
  vaciarCarrito: () => void;
  totalArticulos: () => number;
  totalCarrito: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      articulos: [],
      isCartOpen: false,

      setIsCartOpen: (open) => set({ isCartOpen: open }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      setItems: (articulos) => set({ articulos }),

      agregarAlCarrito: (producto) => {
        const cantidadAAgregar = producto.cantidad ?? 1;

        set((state) => {
          const index = state.articulos.findIndex((item) => item.id === producto.id);

          if (index !== -1) {
            const nuevos = [...state.articulos];
            nuevos[index] = {
              ...nuevos[index],
              cantidad: nuevos[index].cantidad + cantidadAAgregar,
            };
            return { articulos: nuevos };
          }

          return {
            articulos: [
              ...state.articulos,
              {
                ...producto,
                cantidad: cantidadAAgregar,
              },
            ],
          };
        });
      },

      removerDelCarrito: (id) => {
        set((state) => {
          const index = state.articulos.findIndex((item) => item.id === id);
          if (index === -1) return state;

          if (state.articulos[index].cantidad > 1) {
            const nuevos = [...state.articulos];
            nuevos[index] = {
              ...nuevos[index],
              cantidad: nuevos[index].cantidad - 1,
            };
            return { articulos: nuevos };
          }

          return {
            articulos: state.articulos.filter((item) => item.id !== id),
          };
        });
      },

      eliminarProducto: (id) => {
        set((state) => ({
          articulos: state.articulos.filter((item) => item.id !== id),
        }));
      },

      vaciarCarrito: () => {
        set({ articulos: [] });
      },

      totalArticulos: () => {
        return get().articulos.reduce((acc, item) => acc + item.cantidad, 0);
      },

      totalCarrito: () => {
        return calculateSubtotal(get().articulos);
      },
    }),
    {
      name: 'foodflow_cart_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ articulos: state.articulos }),
    }
  )
);

export const useCart = () => {
  const store = useCartStore();
  return {
    ...store,
    totalArticulos: store.totalArticulos(),
    totalCarrito: store.totalCarrito(),
  };
};
