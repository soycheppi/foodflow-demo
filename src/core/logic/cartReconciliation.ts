import { Product } from '@/core/types/catalog';
import type { CartItem } from '@/core/types/order';

type ReconciliationItemStatus =
  | 'UNCHANGED'
  | 'PRICE_UPDATED'
  | 'OUT_OF_STOCK'
  | 'DELETED_FROM_CATALOG'
  | 'QUANTITY_CAPPED';

interface CartReconciliationItem {
  readonly item: CartItem;
  readonly status: ReconciliationItemStatus;
  readonly previousPrice?: number;
  readonly newPrice?: number;
  readonly previousQuantity?: number;
  readonly adjustedQuantity?: number;
  readonly message?: string;
}

export interface CartReconciliationReport {
  readonly reconciledItems: readonly CartItem[];
  readonly itemReports: readonly CartReconciliationItem[];
  readonly hasPriceChanges: boolean;
  readonly hasAvailabilityIssues: boolean;
  readonly removedItemsCount: number;
}

export function reconcileCartWithCatalog(
  cartItems: readonly CartItem[],
  catalogProducts: readonly Product[]
): CartReconciliationReport {
  const catalogMap = new Map<string, Product>();
  for (const prod of catalogProducts) {
    catalogMap.set(prod.id, prod);
  }

  const reconciledItems: CartItem[] = [];
  const itemReports: CartReconciliationItem[] = [];

  let hasPriceChanges = false;
  let hasAvailabilityIssues = false;
  let removedItemsCount = 0;

  for (const item of cartItems) {
    const freshProduct = catalogMap.get(item.id);

    if (!freshProduct) {
      hasAvailabilityIssues = true;
      removedItemsCount += 1;
      itemReports.push({
        item,
        status: 'DELETED_FROM_CATALOG',
        message: `Product "${item.nombre}" is no longer available.`,
      });
      continue;
    }

    if (freshProduct.stock <= 0) {
      hasAvailabilityIssues = true;
      removedItemsCount += 1;
      itemReports.push({
        item,
        status: 'OUT_OF_STOCK',
        message: `"${freshProduct.nombre}" is currently out of stock.`,
      });
      continue;
    }

    let finalQuantity = item.cantidad;
    let quantityCapped = false;
    if (item.cantidad > freshProduct.stock) {
      finalQuantity = freshProduct.stock;
      quantityCapped = true;
      hasAvailabilityIssues = true;
    }

    const priceChanged = freshProduct.precio !== item.precio;
    if (priceChanged) {
      hasPriceChanges = true;
    }

    const updatedItem: CartItem = {
      ...freshProduct,
      cantidad: finalQuantity,
    };

    reconciledItems.push(updatedItem);

    if (quantityCapped) {
      itemReports.push({
        item: updatedItem,
        status: 'QUANTITY_CAPPED',
        previousQuantity: item.cantidad,
        adjustedQuantity: finalQuantity,
        message: `Quantity for "${freshProduct.nombre}" adjusted to remaining stock (${finalQuantity}).`,
      });
    } else if (priceChanged) {
      itemReports.push({
        item: updatedItem,
        status: 'PRICE_UPDATED',
        previousPrice: item.precio,
        newPrice: freshProduct.precio,
        message: `Price for "${freshProduct.nombre}" updated.`,
      });
    } else {
      itemReports.push({
        item: updatedItem,
        status: 'UNCHANGED',
      });
    }
  }

  return {
    reconciledItems,
    itemReports,
    hasPriceChanges,
    hasAvailabilityIssues,
    removedItemsCount,
  };
}
