interface ProductModifier {
  readonly id: string;
  readonly name: string;
  readonly extraPrice: number;
}

export interface ProductOptionGroup {
  readonly id: string;
  readonly name: string;
  readonly required: boolean;
  readonly maxSelection: number;
  readonly options: readonly ProductModifier[];
}

export interface SelectedProductCustomization {
  readonly optionGroupId: string;
  readonly selectedModifierIds: readonly string[];
}

export function generateCartItemId(
  productId: string,
  customizations: readonly SelectedProductCustomization[] = []
): string {
  if (!customizations || customizations.length === 0) {
    return productId;
  }

  const sorted = [...customizations]
    .sort((a, b) => a.optionGroupId.localeCompare(b.optionGroupId))
    .map((group) => {
      const sortedMods = [...group.selectedModifierIds].sort().join(',');
      return `${group.optionGroupId}:${sortedMods}`;
    })
    .join('|');

  return `${productId}__custom__${sorted}`;
}

export function calculateCustomizationsExtraPrice(
  optionGroups: readonly ProductOptionGroup[] = [],
  customizations: readonly SelectedProductCustomization[] = []
): number {
  let totalExtra = 0;

  const groupMap = new Map<string, ProductOptionGroup>();
  for (const group of optionGroups) {
    groupMap.set(group.id, group);
  }

  for (const cust of customizations) {
    const group = groupMap.get(cust.optionGroupId);
    if (!group) continue;

    const modifierMap = new Map<string, ProductModifier>();
    for (const mod of group.options) {
      modifierMap.set(mod.id, mod);
    }

    for (const modId of cust.selectedModifierIds) {
      const mod = modifierMap.get(modId);
      if (mod && mod.extraPrice > 0) {
        totalExtra += mod.extraPrice;
      }
    }
  }

  return Math.round(totalExtra * 100) / 100;
}
