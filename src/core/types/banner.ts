export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  active: boolean;
  order: number;
  createdAt: Date | string | null;
  link?: string;
  onlyImage?: boolean;
  imageFit?: 'cover' | 'contain';
}
