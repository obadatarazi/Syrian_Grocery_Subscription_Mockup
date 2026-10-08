import type { AdminUser } from "@/features/users/types/users.types";
import { MediaImage, StatusBadge, UserAvatar } from "@/shared/components";
import { CrudDetailField, CrudViewDialog, type CrudViewDialogSection } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type UserViewDialogProps = {
  open: boolean;
  user: AdminUser | null;
  canUpdate?: boolean;
  canDelete?: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
};

export function UserViewDialog({
  open,
  user,
  canUpdate = false,
  canDelete = false,
  onOpenChange,
  onEdit,
  onDelete,
}: UserViewDialogProps) {
  const t = useTranslation();

  if (!user) return null;

  const notSet = <span className="text-muted-foreground">{t.notSet}</span>;

  const sections: CrudViewDialogSection[] = [
    {
      id: "content",
      title: t.userContent,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label={t.email}>{user.email || notSet}</CrudDetailField>
          <CrudDetailField label={t.phone}>{user.phoneNumber || notSet}</CrudDetailField>
          <CrudDetailField label={t.gender}>
            {user.gender?.label ??
              (user.gender?.value === "MALE"
                ? t.male
                : user.gender?.value === "FEMALE"
                  ? t.female
                  : notSet)}
          </CrudDetailField>
        </div>
      ),
    },
    {
      id: "details",
      title: t.userDetails,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label="ID">{user.id}</CrudDetailField>
          <CrudDetailField label={t.userType}>{user.type?.label ?? notSet}</CrudDetailField>
          <CrudDetailField label={t.roles}>
            {user.roles?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {user.roles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            ) : (
              notSet
            )}
          </CrudDetailField>
        </div>
      ),
    },
  ];

  return (
    <CrudViewDialog
      open={open}
      entity={user}
      onOpenChange={onOpenChange}
      title={t.viewUser}
      cancelLabel={t.cancel}
      canUpdate={canUpdate}
      canDelete={canDelete}
      editLabel={t.editAction}
      deleteLabel={t.deleteAction}
      onEdit={onEdit}
      onDelete={onDelete}
      sections={sections}
      hero={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {user.avatarFileUrl ? (
            <MediaImage
              src={user.avatarFileUrl}
              alt=""
              className="size-20 shrink-0 rounded-xl border border-border object-cover shadow-sm"
            />
          ) : (
            <UserAvatar name={user.fullName} size="lg" className="size-20 shrink-0 text-2xl" />
          )}

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="text-lg font-semibold text-foreground">{user.fullName}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge
                label={user.active ? t.active : t.inactive}
                variant={user.active ? "success" : "neutral"}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
