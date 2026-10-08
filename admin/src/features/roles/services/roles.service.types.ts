import type {
  PermissionListParams,
  PermissionListResult,
  PermissionSection,
  Role,
  RoleFormData,
  RoleListParams,
  RoleListResult,
} from "@/features/roles/types/roles.types";

export interface RolesService {
  list(params?: RoleListParams, signal?: AbortSignal): Promise<RoleListResult>;
  getById(id: number, signal?: AbortSignal): Promise<Role>;
  create(data: RoleFormData): Promise<Role>;
  update(id: number, data: Partial<RoleFormData>): Promise<Role>;
  delete(id: number): Promise<void>;
  getPermissionsBySection(): Promise<PermissionSection[]>;
  listPermissions(params?: PermissionListParams, signal?: AbortSignal): Promise<PermissionListResult>;
  /** Fetches every permissions page and returns the merged collection. Throws if incomplete. */
  listAllPermissions(options?: {
    pageSize?: number;
    sort?: string;
    direction?: "asc" | "desc";
    signal?: AbortSignal;
  }): Promise<PermissionListResult>;
}
