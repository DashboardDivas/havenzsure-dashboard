import type { AuthUser } from "@/types/user";

// Role codes
export const ROLE_SUPERADMIN = "superadmin";
export const ROLE_ADMIN = "admin";
export const ROLE_ADJUSTER = "adjuster";
export const ROLE_BODYMAN = "bodyman";

export type RoleCode =
  | typeof ROLE_SUPERADMIN
  | typeof ROLE_ADMIN
  | typeof ROLE_ADJUSTER
  | typeof ROLE_BODYMAN;

// common role groups
const ADMIN_ROLES: RoleCode[] = [ROLE_SUPERADMIN, ROLE_ADMIN];
const TECH_ROLES: RoleCode[] = [ROLE_ADJUSTER, ROLE_BODYMAN];

// all roles
const ALL_ROLES: RoleCode[] = [
  ROLE_SUPERADMIN,
  ROLE_ADMIN,
  ROLE_ADJUSTER,
  ROLE_BODYMAN,
];

// core role checking function
// ensure the user's role is in the allowed list
export function hasRole(user: AuthUser | null, allowed: RoleCode[]): boolean {
  const code = user?.roleCode;
  if (!code || !ALL_ROLES.includes(code as RoleCode)) return false;
  return allowed.includes(code as RoleCode);
}

// factory: create a helper to check certain roles
function createRoleGuard(allowed: RoleCode[]) {
  return (user: AuthUser | null) => hasRole(user, allowed);
}

// ===== external permission functions (clear semantics, internal shared logic) =====

// manage users
export const canManageUsers = createRoleGuard(ADMIN_ROLES);

// manage shops
export const canManageShops = createRoleGuard(ADMIN_ROLES);

// view admin dashboard
export const canViewAdminDashboard = createRoleGuard(ADMIN_ROLES);

// view technician dashboard
export const canViewTechnicianDashboard = createRoleGuard(TECH_ROLES);
