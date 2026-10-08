import {
  areNumberArraysEqual,
  hasFormChanges,
  normalizedStringEqual,
  pickChangedScalar,
} from "@/shared/lib/form/pick-changed-fields";
import type { PaginatedResult } from "@/shared/types";

export type UserType = "ADMIN" | "CUSTOMER";
export type UserGender = "MALE" | "FEMALE";

export type AdminRole = {
  id: number;
  name: string;
};

export type AdminUser = {
  id: number;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  gender?: { label: string; value: UserGender } | null;
  type?: { label: string; value: UserType } | null;
  avatarFileUrl?: string | null;
  active?: boolean;
  roles?: AdminRole[];
  createdAt?: string;
};

export type UserListParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: UserType;
  active?: boolean;
};

export type UserFormData = {
  fullName: string;
  email?: string;
  phoneNumber: string;
  password?: string;
  passwordConfirmation?: string;
  gender?: UserGender;
  type: UserType;
  dateOfBirth?: string;
  active?: boolean;
  roles: number[];
  avatar?: File | null;
};

export type UserListResult = PaginatedResult<AdminUser>;

export function createEmptyUserForm(defaultType: UserType = "CUSTOMER"): UserFormData {
  return {
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
    type: defaultType,
    active: true,
    roles: [],
    avatar: null,
  };
}

export function userToFormData(user: AdminUser): UserFormData {
  return {
    fullName: user.fullName,
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    gender: user.gender?.value,
    type: user.type?.value ?? "CUSTOMER",
    active: user.active ?? true,
    roles: user.roles?.map((role) => role.id) ?? [],
    avatar: null,
  };
}

export function pickUserFormChanges(
  original: UserFormData,
  current: UserFormData,
): Partial<UserFormData> {
  const changes: Partial<UserFormData> = {
    ...pickChangedScalar(original, current, [
      "fullName",
      "phoneNumber",
      "gender",
      "type",
      "dateOfBirth",
      "active",
    ], (key, originalValue, currentValue) => {
      if (key === "fullName" || key === "phoneNumber" || key === "dateOfBirth") {
        return !normalizedStringEqual(
          originalValue as string | undefined,
          currentValue as string | undefined,
        );
      }
      return originalValue !== currentValue;
    }),
  };

  if (!normalizedStringEqual(original.email, current.email)) {
    changes.email = current.email;
  }

  if (
    current.type === "ADMIN" &&
    !areNumberArraysEqual(original.roles, current.roles)
  ) {
    changes.roles = current.roles;
  }

  if (current.avatar instanceof File) {
    changes.avatar = current.avatar;
  }

  if (current.password?.trim()) {
    changes.password = current.password;
    changes.passwordConfirmation = current.passwordConfirmation;
  }

  return changes;
}

export function hasUserFormChanges(
  original: UserFormData,
  current: UserFormData,
): boolean {
  return hasFormChanges(pickUserFormChanges(original, current));
}
