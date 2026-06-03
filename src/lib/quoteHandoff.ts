import type { ServiceType } from '../types';

export type EstimatorAddOnId = 'chips_salsa' | 'dessert' | 'drinks' | 'setup';

export interface QuoteHandoffPayload {
  /** Changes when user continues from estimator — triggers MenuPresentation sync */
  id: number;
  cateringPackageId: string;
  cateringPackageName: string;
  guestCount: number;
  serviceType: ServiceType;
  addOns: Record<EstimatorAddOnId, boolean>;
  estimatedMidpoint: number;
}

export type QuoteContinueInput = Omit<QuoteHandoffPayload, 'id'>;

const ESTIMATOR_ADDON_TO_SINGLE_ITEM: Partial<Record<EstimatorAddOnId, string>> = {
  chips_salsa: 'chips-salsa',
  dessert: 'churros',
  drinks: 'horchata',
};

/** Map flyer/catalog package to the 3-tab menu builder. */
export function resolveMainPackageId(_cateringPackageId: string, packageName: string): string {
  const n = packageName.toLowerCase();
  if (n.includes('enchilada')) return 'enchiladas';
  if (n.includes('quesadilla') || n.includes('burrito')) return 'quesadillas';
  return 'street-tacos';
}

export function buildItemCountsFromEstimatorAddOns(
  addOns: Record<EstimatorAddOnId, boolean>
): Record<string, number> {
  const counts: Record<string, number> = {};
  (Object.keys(addOns) as EstimatorAddOnId[]).forEach(id => {
    if (!addOns[id]) return;
    const singleId = ESTIMATOR_ADDON_TO_SINGLE_ITEM[id];
    if (singleId) counts[singleId] = (counts[singleId] ?? 0) + 1;
  });
  return counts;
}

export function buildHandoffNotes(
  packageName: string,
  addOns: Record<EstimatorAddOnId, boolean>,
  estimatedMidpoint: number
): string {
  const parts = [`Instant quote: ${packageName}`, `Planning midpoint ~$${estimatedMidpoint}`];
  if (addOns.setup) parts.push('Setup service requested');
  return parts.join(' · ');
}
