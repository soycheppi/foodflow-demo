import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '@/modules/catalog/components/ProductCard';
import { Product, CartItem } from '@/core/types/catalog';
import { restaurantConfig } from '@/config/restaurant.config';

const mockProduct: Product = {
  id: 'prod-truffle-burger',
  nombre: 'Truffle Bacon Deluxe',
  descripcion: 'Fresh artisan burger with black truffle mayo',
  precio: 3200,
  stock: 10,
  categoria: 'cat-burgers',
  imagenUrl: 'https://images.unsplash.com/burger.jpg',
  orden: 1,
  permiteReserva: false,
};

describe('ProductCard Component', () => {
  it('renders product title, formatted price with currency and description', () => {
    const handleAddToCart = vi.fn();
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
      </MemoryRouter>
    );

    expect(screen.getByText('Truffle Bacon Deluxe')).toBeInTheDocument();
    expect(screen.getByText('Fresh artisan burger with black truffle mayo')).toBeInTheDocument();
    expect(screen.getByText(`${restaurantConfig.business.currencySymbol}3200.00`)).toBeInTheDocument();
  });

  it('triggers onAddToCart callback when add button is clicked on in-stock product', () => {
    const handleAddToCart = vi.fn();
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: /add to cart|agregar/i });
    fireEvent.click(addButton);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith({
      ...mockProduct,
      cantidad: 1,
    });
  });

  it('renders disabled out of stock badge when stock is 0', () => {
    const handleAddToCart = vi.fn();
    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(
      <MemoryRouter>
        <ProductCard product={outOfStockProduct} onAddToCart={handleAddToCart} />
      </MemoryRouter>
    );

    const disabledButtons = screen.getAllByRole('button');
    const disabledButton = disabledButtons.find((btn) => btn.hasAttribute('disabled'));
    expect(disabledButton).toBeDefined();
    expect(disabledButton).toBeDisabled();

    if (disabledButton) {
      fireEvent.click(disabledButton);
      expect(handleAddToCart).not.toHaveBeenCalled();
    }
  });

  it('renders correctly when product description is empty or missing', () => {
    const productWithoutDesc = { ...mockProduct, descripcion: undefined };
    render(
      <MemoryRouter>
        <ProductCard product={productWithoutDesc} onAddToCart={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Truffle Bacon Deluxe')).toBeInTheDocument();
  });

  it('handles click gracefully when onAddToCart callback is omitted', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} onAddToCart={undefined as unknown as (item: CartItem) => void} />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: /add to cart|agregar/i });
    expect(() => fireEvent.click(addButton)).not.toThrow();
  });
});
