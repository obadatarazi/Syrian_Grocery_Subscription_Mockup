/** Format Syrian Pound (SYP) — integer, no decimals. */
export function formatSyp(amount: number) {
  return `${Math.round(amount).toLocaleString("ar-SY")} ل.س`;
}

/** @deprecated Use formatSyp instead */
export function formatKwd(amount: number) {
  return formatSyp(amount);
}

export function stockBarColor(stock: number, reorder: number) {
  if (stock === 0) return "bg-destructive";
  if (stock <= reorder) return "bg-warning";
  return "bg-success";
}
