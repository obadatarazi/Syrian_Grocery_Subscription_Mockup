import { AbilityBuilder, createMongoAbility } from "@casl/ability";

import type { AppAbility } from "@/features/auth/ability/types";
import { expandManagePermissions } from "@/shared/constants/permissions";

export function createAbility(permissions: string[]): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  const effectivePermissions = expandManagePermissions(permissions);

  for (const permission of effectivePermissions) {
    can(permission, "all");
  }

  return build();
}

export function collectUserPermissions(
  roles: { permissions: string[] }[] | undefined,
): string[] {
  if (!roles?.length) return [];
  return roles.flatMap((role) => role.permissions);
}
