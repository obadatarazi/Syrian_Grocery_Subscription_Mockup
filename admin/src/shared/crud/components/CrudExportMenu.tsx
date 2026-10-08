import { Download } from "lucide-react";

import { AppButton } from "@/shared/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/design-system/components/ui/dropdown-menu";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type CrudExportMenuProps = {
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  onPrint?: () => void;
  disabled?: boolean;
};

export function CrudExportMenu({
  onExportCsv,
  onExportExcel,
  onExportPdf,
  onPrint,
  disabled = false,
}: CrudExportMenuProps) {
  const t = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton variant="outline" disabled={disabled}>
          <Download className="size-4" />
          {t.exportData}
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={!onExportCsv} onClick={onExportCsv}>
          {t.exportCsv}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!onExportExcel} onClick={onExportExcel}>
          {t.exportExcel}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!onExportPdf} onClick={onExportPdf}>
          {t.exportPdf}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!onPrint} onClick={onPrint}>
          {t.exportPrint}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
