import type { CrmCustomer, CrmSegment, CrmTag } from "@/features/customers/types/customers.types";

const NEW_BUYER_MAX_ORDERS = 1;
const BIG_SPENDER_KWD = 200;
const INACTIVE_DAYS = 45;

export function daysSince(iso: string | null, now = Date.now()): number | null {
  if (!iso) return null;
  const at = new Date(iso).getTime();
  if (Number.isNaN(at)) return null;
  return Math.floor((now - at) / (1000 * 60 * 60 * 24));
}

export function isInactiveCustomer(customer: CrmCustomer, now = Date.now()): boolean {
  if (customer.status === "inactive") return true;
  if (customer.tags.includes("inactive")) return true;
  const since = daysSince(customer.lastOrderAt, now);
  return since != null && since >= INACTIVE_DAYS;
}

export function isBigSpender(customer: CrmCustomer): boolean {
  return customer.spent >= BIG_SPENDER_KWD || customer.tags.includes("high_value");
}

export function hasActiveCarePlan(customer: CrmCustomer): boolean {
  return customer.carePlan?.status === "ACTIVE";
}

export function customerMatchesSegment(
  customer: CrmCustomer,
  segment: CrmSegment,
  now = Date.now(),
): boolean {
  switch (segment) {
    case "new_buyers":
      return customer.ordersCount <= NEW_BUYER_MAX_ORDERS && !isInactiveCustomer(customer, now);
    case "repeat_buyers":
      return customer.ordersCount >= 2;
    case "care_plan":
      return hasActiveCarePlan(customer);
    case "inactive":
      return isInactiveCustomer(customer, now);
    case "big_spenders":
      return isBigSpender(customer);
  }
}

export function customerHasTag(customer: CrmCustomer, tag: CrmTag): boolean {
  if (customer.tags.includes(tag)) return true;
  if (tag === "care_plan") return hasActiveCarePlan(customer);
  if (tag === "high_value") return isBigSpender(customer);
  if (tag === "inactive") return isInactiveCustomer(customer);
  if (tag === "prescription") return customer.prescriptions.length > 0;
  return false;
}

export function visibleTags(customer: CrmCustomer): CrmTag[] {
  const tags = new Set<CrmTag>(customer.tags);
  if (hasActiveCarePlan(customer)) tags.add("care_plan");
  if (isBigSpender(customer)) tags.add("high_value");
  if (isInactiveCustomer(customer)) tags.add("inactive");
  if (customer.prescriptions.length > 0) tags.add("prescription");
  return [...tags];
}
