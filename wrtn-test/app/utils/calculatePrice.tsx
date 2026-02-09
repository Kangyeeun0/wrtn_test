export type PlanType = "FIXED" | "VARIABLE";

interface Params {
  monthlyKwh: number;
  planType: PlanType;
  years?: 1 | 2 | 3;
  hasSmartMeter: boolean;
  installSmartMeter: boolean;
}

const PRICE_PER_KWH = 120;
const MANAGEMENT_FEE = 80000;
const TAX_PER_KWH = 0.2;
const SMART_METER_PRICE = 200000;

export function calculatePrice({
  monthlyKwh,
  planType,
  years,
  hasSmartMeter,
  installSmartMeter,
}: Params) {
  const basePrice = Math.floor(monthlyKwh * PRICE_PER_KWH);
  const tax = Math.floor(monthlyKwh * TAX_PER_KWH);
  const monthlyTotal = basePrice + tax + MANAGEMENT_FEE;

  let discountRate = 0;
  if (planType === "FIXED" && years) {
    discountRate = years * 0.2;
  }

  const discountAmount = Math.floor(monthlyTotal * discountRate);
  const finalMonthly = monthlyTotal - discountAmount;
  const yearlyTotal = finalMonthly * 12;

  const smartMeterCost =
    !hasSmartMeter && installSmartMeter ? SMART_METER_PRICE : 0;

  return {
    basePrice,
    tax,
    managementFee: MANAGEMENT_FEE,
    discountAmount,
    finalMonthly,
    yearlyTotal,
    smartMeterCost,
    totalPayment: yearlyTotal + smartMeterCost,
  };
}