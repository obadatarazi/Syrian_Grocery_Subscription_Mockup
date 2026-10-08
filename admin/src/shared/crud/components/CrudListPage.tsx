import { type ReactNode } from "react";

import { PageContainer, PageHeader } from "@/shared/components";
import { GuidancePageNotices } from "@/shared/guidance/components/GuidancePageNotices";

type CrudListPageProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  titleDataGuidance?: string;
  /** Wraps the actions cluster for in-app guidance tours (e.g. Add button). */
  actionsDataGuidance?: string;
};

export function CrudListPage({
  title,
  description,
  actions,
  children,
  titleDataGuidance,
  actionsDataGuidance,
}: CrudListPageProps) {
  const actionsNode =
    actions && actionsDataGuidance ? (
      <div data-guidance={actionsDataGuidance} className="inline-flex flex-wrap items-center gap-2">
        {actions}
      </div>
    ) : (
      actions
    );

  return (
    <PageContainer>
      <PageHeader
        title={title}
        description={description}
        actions={actionsNode}
        titleDataGuidance={titleDataGuidance}
      />
      <GuidancePageNotices />
      {children}
    </PageContainer>
  );
}
