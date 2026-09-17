export interface Category {
  id: string;
  nombre: string;
  orden: number;
  imagenUrl?: string;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
  categoria: string;
  orden: number;
  creadoEl?: Date | string | null;
  actualizadoEl?: Date | string | null;
  permiteReserva?: boolean;
}

/** @deprecated Use Category instead */
export type AlfreCategory = Category;

/** @deprecated Use Product instead */
export type AlfreProduct = Product;

export type { CartItem } from '@/core/types/order';
