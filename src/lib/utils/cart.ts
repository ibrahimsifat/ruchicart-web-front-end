import { FormattedVariation } from "@/types/product";

export function formatVariations(variations: Record<string, any>) {
  const formattedVariations: Record<string, FormattedVariation> = {};
  for (const variationName in variations) {
    formattedVariations[variationName] = {
      name: variationName,
      values: {
        label: Array.isArray(variations[variationName])
          ? variations[variationName]
          : [variations[variationName]], // Ensure values are always arrays
      },
    };
  }
  return formattedVariations;
}
