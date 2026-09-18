export interface Category {
  readonly id: string;
  readonly nombre: string;
  readonly orden: number;
  readonly imagenUrl?: string;
}

export interface Product {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion?: string;
  readonly precio: number;
  readonly stock: number;
  readonly imagenUrl?: string;
  readonly categoria: string;
  readonly orden: number;
  readonly creadoEl?: Date | string | null;
  readonly actualizadoEl?: Date | string | null;
  readonly permiteReserva?: boolean;
}
