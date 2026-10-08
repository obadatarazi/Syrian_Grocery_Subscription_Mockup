import { Link } from "react-router";

import type { OrderPartyDisplay } from "@/features/orders/utils/order-customer-display";
import {
  orderCustomerHref,
  orderPartyDisplayName,
} from "@/features/orders/utils/order-customer-display";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type OrderCustomerCellProps = {
  party: OrderPartyDisplay;
};

/** Buyer full name + email. Created-by type lives in its own column. */
export function OrderCustomerCell({ party }: OrderCustomerCellProps) {
  const t = useTranslation();
  const name = orderPartyDisplayName(party, t.guest);
  const href = orderCustomerHref(party);

  return (
    <div className="min-w-[9rem] max-w-[14rem]">
      {href ? (
        <Link
          to={href}
          className="block truncate text-xs font-semibold text-brand hover:underline"
          title={name}
          onClick={(event) => event.stopPropagation()}
        >
          {name}
        </Link>
      ) : (
        <p className="truncate text-xs font-semibold text-foreground" title={name}>
          {name}
        </p>
      )}
      {party.email ? (
        <p className="truncate text-[10px] text-muted-foreground" title={party.email}>
          {party.email}
        </p>
      ) : null}
    </div>
  );
}
