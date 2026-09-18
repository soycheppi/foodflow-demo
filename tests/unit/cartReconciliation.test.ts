import { describe, it, expect } from 'vitest';
import { reconcileCartWithCatalog } from '@/core/logic/cartReconciliation';
import { Product } from '@/core/types/catalog';
import type { CartItem } from '@/core/types/order';

describe('Cart Reconciliation Engine — reconcileCartWithCatalog', () => {
  const catalog: Product[] = [
    { id: '1', nombre: 'Burger Classic', precio: 12.0, stock: 10, categoria: 'burgers', orden: 1 },
    { id: '2', nombre: 'Craft Beer', precio: 6.0, stock: 0, categoria: 'drinks', orden: 2 },
    { id: '3', nombre: 'Loaded Fries', precio: 8.5, stock: 2, categoria: 'sides', orden: 3 },
  ];

  it('preserves cart items when price and stock match catalog', () => {
    const cart: CartItem[] = [
      { id: '1', nombre: 'Burger Classic', precio: 12.0, stock: 10, categoria: 'burgers', orden: 1, cantidad: 2 },
    ];

    const report = reconcileCartWithCatalog(cart, catalog);

    expect(report.hasPriceChanges).toBe(false);
    expect(report.hasAvailabilityIssues).toBe(false);
    expect(report.reconciledItems).toHaveLength(1);
    expect(report.reconciledItems[0].cantidad).toBe(2);
    expect(report.itemReports[0].status).toBe('UNCHANGED');
  });

  it('detects and applies price drift updates cleanly', () => {
    // Client had burger at old price 10.0, current price is 12.0
    const cart: CartItem[] = [
      { id: '1', nombre: 'Burger Classic', precio: 10.0, stock: 10, categoria: 'burgers', orden: 1, cantidad: 1 },
    ];

    const report = reconcileCartWithCatalog(cart, catalog);

    expect(report.hasPriceChanges).toBe(true);
    expect(report.reconciledItems[0].precio).toBe(12.0);
    expect(report.itemReports[0].status).toBe('PRICE_UPDATED');
    expect(report.itemReports[0].previousPrice).toBe(10.0);
    expect(report.itemReports[0].newPrice).toBe(12.0);
  });

  it('removes out-of-stock products from reconciled items', () => {
    // Product 2 has stock 0
    const cart: CartItem[] = [
      { id: '2', nombre: 'Craft Beer', precio: 6.0, stock: 5, categoria: 'drinks', orden: 2, cantidad: 1 },
    ];

    const report = reconcileCartWithCatalog(cart, catalog);

    expect(report.hasAvailabilityIssues).toBe(true);
    expect(report.removedItemsCount).toBe(1);
    expect(report.reconciledItems).toHaveLength(0);
    expect(report.itemReports[0].status).toBe('OUT_OF_STOCK');
  });

  it('caps item quantity to maximum available remaining stock', () => {
    // Client has quantity 5, but catalog stock is 2
    const cart: CartItem[] = [
      { id: '3', nombre: 'Loaded Fries', precio: 8.5, stock: 10, categoria: 'sides', orden: 3, cantidad: 5 },
    ];

    const report = reconcileCartWithCatalog(cart, catalog);

    expect(report.hasAvailabilityIssues).toBe(true);
    expect(report.reconciledItems[0].cantidad).toBe(2);
    expect(report.itemReports[0].status).toBe('QUANTITY_CAPPED');
    expect(report.itemReports[0].previousQuantity).toBe(5);
    expect(report.itemReports[0].adjustedQuantity).toBe(2);
  });

  it('removes products that were deleted from the catalog', () => {
    // Product 99 no longer exists
    const cart: CartItem[] = [
      { id: '99', nombre: 'Discontinued Dessert', precio: 5.0, stock: 10, categoria: 'desserts', orden: 99, cantidad: 1 },
    ];

    const report = reconcileCartWithCatalog(cart, catalog);

    expect(report.hasAvailabilityIssues).toBe(true);
    expect(report.removedItemsCount).toBe(1);
    expect(report.reconciledItems).toHaveLength(0);
    expect(report.itemReports[0].status).toBe('DELETED_FROM_CATALOG');
  });
});
