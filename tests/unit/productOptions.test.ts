import { describe, it, expect } from 'vitest';
import {
  generateCartItemId,
  calculateCustomizationsExtraPrice,
  ProductOptionGroup,
  SelectedProductCustomization,
} from '@/core/types/productOptions';

describe('Product Options & Customization Domain', () => {
  const sampleGroups: ProductOptionGroup[] = [
    {
      id: 'toppings',
      name: 'Toppings',
      required: false,
      maxSelection: 3,
      options: [
        { id: 'bacon', name: 'Crispy Bacon', extraPrice: 1.5 },
        { id: 'cheese', name: 'Cheddar Cheese', extraPrice: 1.0 },
      ],
    },
    {
      id: 'sauce',
      name: 'Special Sauce',
      required: true,
      maxSelection: 1,
      options: [
        { id: 'truffle', name: 'Truffle Mayo', extraPrice: 0.75 },
        { id: 'bbq', name: 'Smoky BBQ', extraPrice: 0.0 },
      ],
    },
  ];

  it('generates standard product ID when no customizations are selected', () => {
    const id = generateCartItemId('prod-123', []);
    expect(id).toBe('prod-123');
  });

  it('generates deterministic hash regardless of array order', () => {
    const customOrderA: SelectedProductCustomization[] = [
      { optionGroupId: 'toppings', selectedModifierIds: ['cheese', 'bacon'] },
      { optionGroupId: 'sauce', selectedModifierIds: ['truffle'] },
    ];

    const customOrderB: SelectedProductCustomization[] = [
      { optionGroupId: 'sauce', selectedModifierIds: ['truffle'] },
      { optionGroupId: 'toppings', selectedModifierIds: ['bacon', 'cheese'] },
    ];

    const idA = generateCartItemId('prod-123', customOrderA);
    const idB = generateCartItemId('prod-123', customOrderB);

    expect(idA).toBe(idB);
    expect(idA).toContain('prod-123__custom__');
  });

  it('distinguishes different customizations on the same product', () => {
    const customPlain: SelectedProductCustomization[] = [
      { optionGroupId: 'sauce', selectedModifierIds: ['bbq'] },
    ];

    const customDeluxe: SelectedProductCustomization[] = [
      { optionGroupId: 'sauce', selectedModifierIds: ['truffle'] },
      { optionGroupId: 'toppings', selectedModifierIds: ['bacon'] },
    ];

    const idPlain = generateCartItemId('prod-123', customPlain);
    const idDeluxe = generateCartItemId('prod-123', customDeluxe);

    expect(idPlain).not.toBe(idDeluxe);
  });

  it('calculates total extra price accurately', () => {
    const selected: SelectedProductCustomization[] = [
      { optionGroupId: 'toppings', selectedModifierIds: ['bacon', 'cheese'] }, // 1.5 + 1.0 = 2.5
      { optionGroupId: 'sauce', selectedModifierIds: ['truffle'] },             // 0.75
    ];

    const extra = calculateCustomizationsExtraPrice(sampleGroups, selected);
    expect(extra).toBe(3.25);
  });
});
