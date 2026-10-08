import { Check, FileText, X } from "lucide-react";
import { useCallback, useState } from "react";

import {
  AppButton,
  AppCard,
  PageContainer,
  PageHeader,
  StatusBadge,
  type StatusBadgeVariant,
} from "@/shared/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/design-system/components/ui/table";
import { cn } from "@/shared/design-system/components/ui/utils";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import {
  AdminPaginationBar,
  AdminRowActions,
  AdminTableToolbar,
  DemoDataBanner,
  PRESCRIPTIONS,
  usePaged,
} from "@/shared/demo";
import type { Prescription, PrescriptionStatus } from "@/shared/demo/types/admin-demo.types";

type StatusSummary = {
  status: PrescriptionStatus;
  labelKey: "pending" | "approved" | "rejected";
  iconClass: string;
  bgClass: string;
};

const STATUS_SUMMARIES: StatusSummary[] = [
  {
    status: "pending",
    labelKey: "pending",
    iconClass: "text-warning",
    bgClass: "bg-warning-muted",
  },
  {
    status: "approved",
    labelKey: "approved",
    iconClass: "text-success",
    bgClass: "bg-success-muted",
  },
  {
    status: "rejected",
    labelKey: "rejected",
    iconClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
];

const STATUS_VARIANTS: Record<PrescriptionStatus, StatusBadgeVariant> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const STATUS_LABELS: Record<PrescriptionStatus, "pending" | "approved" | "rejected"> = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
};

export function PrescriptionsPage() {
  const t = useTranslation();
  const { direction } = useLocalization();
  const isRTL = direction === "rtl";

  const [rxList, setRxList] = useState<Prescription[]>(PRESCRIPTIONS);
  const { search, setSearch, page, setPage, pages, slice, total, filteredLen } = usePaged(
    rxList,
    8,
  );

  const updateStatus = useCallback((id: string, status: PrescriptionStatus) => {
    setRxList((list) => list.map((rx) => (rx.id === id ? { ...rx, status } : rx)));
  }, []);

  const approve = useCallback(
    (id: string) => {
      updateStatus(id, "approved");
    },
    [updateStatus],
  );

  const reject = useCallback(
    (id: string) => {
      updateStatus(id, "rejected");
    },
    [updateStatus],
  );

  return (
    <PageContainer>
      <DemoDataBanner />
      <PageHeader title={t.prescriptions} titleDataGuidance="prescriptions-title" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATUS_SUMMARIES.map(({ status, labelKey, iconClass, bgClass }) => (
          <AppCard key={status} contentClassName="flex flex-row items-center gap-3 py-4">
            <div
              className={cn(
                "flex size-10 flex-none items-center justify-center rounded-xl",
                bgClass,
              )}
            >
              <FileText className={cn("size-5", iconClass)} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {rxList.filter((rx) => rx.status === status).length}
              </p>
              <p className="text-xs text-muted-foreground">{t[labelKey]}</p>
            </div>
          </AppCard>
        ))}
      </div>

      <AppCard padding="none" className="overflow-hidden">
        <AdminTableToolbar search={search} onSearchChange={setSearch} />

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {[t.rxId, t.customer, t.product, t.date, t.status, t.pharmacistNote, ""].map(
                (header, index) => (
                  <TableHead
                    key={index}
                    className="px-4 py-3 text-xs font-bold tracking-wider text-muted-foreground uppercase"
                  >
                    {header}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell className="px-4 py-3.5 font-mono text-xs font-bold text-brand">
                  {rx.id}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-xs font-semibold text-foreground">
                  {isRTL ? rx.customerAr : rx.customerEn}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-xs text-muted-foreground">
                  {isRTL ? rx.productAr : rx.productEn}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-xs text-muted-foreground">
                  {rx.uploadDate}
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <StatusBadge
                    label={t[STATUS_LABELS[rx.status]]}
                    variant={STATUS_VARIANTS[rx.status]}
                  />
                </TableCell>
                <TableCell className="max-w-[200px] truncate px-4 py-3.5 text-xs text-muted-foreground">
                  {isRTL ? rx.noteAr : rx.noteEn}
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  {rx.status === "pending" ? (
                    <div className="flex items-center gap-1.5">
                      <AppButton
                        variant="ghost"
                        size="sm"
                        className="h-7 bg-success-muted px-2.5 text-xs font-bold text-success hover:bg-success-muted/80"
                        onClick={() => approve(rx.id)}
                      >
                        <Check className="size-3" aria-hidden="true" />
                        {t.approveAction}
                      </AppButton>
                      <AppButton
                        variant="ghost"
                        size="sm"
                        className="h-7 bg-destructive/10 px-2.5 text-xs font-bold text-destructive hover:bg-destructive/15"
                        onClick={() => reject(rx.id)}
                      >
                        <X className="size-3" aria-hidden="true" />
                        {t.rejectAction}
                      </AppButton>
                    </div>
                  ) : (
                    <AdminRowActions onView={() => {}} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AdminPaginationBar
          page={page}
          pages={pages}
          total={total}
          filteredLen={filteredLen}
          onPageChange={setPage}
        />
      </AppCard>
    </PageContainer>
  );
}
