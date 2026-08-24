/**
 * Currency-aware price formatting.
 *
 * Replaces the CAD-only `formatCad`. `narrowSymbol` forces the short symbol
 * ($, €, ₹) rather than a locale-qualified one (CA$), so `en-CA` + `CAD` yields
 * "$8.99" — identical to the old hand-rolled formatter. Ranges join with an
 * en-dash, matching the previous "$21.99–$24.99".
 */
export function formatMoney(
  price: number,
  priceMax: number | undefined,
  currency: string,
  locale: string,
): string {
  const fmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  if (priceMax != null && priceMax !== price) {
    return `${fmt.format(price)}–${fmt.format(priceMax)}`
  }
  return fmt.format(price)
}
