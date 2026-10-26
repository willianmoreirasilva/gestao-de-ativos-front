import type { UserRole } from "@/schemas/user";

export type { UserRole };

// Espelha UserResponseSchema do backend (GET /api/users)
export type UserListItem = {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: UserRole;
    emailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type UsersMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type UsersListResponse = {
    users: UserListItem[];
    meta: UsersMeta;
};

// GET /api/users/me
export type MyProfile = {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: UserRole;
    createdAt: string;
};

// GET /api/users/invitations/validate
export type InvitationDetails = {
    email: string;
    role: UserRole;
    expiresAt: string;
};

export type InviteUserPayload = {
    email: string;
    role: UserRole;
};

export type UpdateUserRolePayload = {
    role: UserRole;
};

export type UpdateProfilePayload = {
    name: string;
};

// Resultado de consultas do service: falha nunca vira lista vazia
export type ServiceResult<T> =
    | { data: T; error: null; status: number }
    | { data: null; error: string; status: number | null };

export type UserActionResult =
    | { success: true; message: string }
    | {
          success: false;
          error: string;
          fieldErrors?: Record<string, string[]>;
      };

export type AvatarActionResult =
    | { success: true; image: string | null; message: string }
    | { success: false; error: string };
