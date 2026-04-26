import { env } from "@/lib/env";

const ADMIN_ROLE_NAMES = new Set(["admin", "administrator"]);

type ClaimsUser = Record<string, unknown> & { sub?: string };

/**
 * Determina si el usuario puede usar POST /api/v1/ingest en el backend.
 * La API final sigue siendo la que autoriza; esto solo controla la UI y el BFF.
 */
export function isAdminUser(user: ClaimsUser | null | undefined): boolean {
  if (!user) return false;
  const claim = user[env.rolesClaim];
  const roles: unknown[] = Array.isArray(claim)
    ? claim
    : typeof claim === "string"
      ? claim.split(/[,\s]+/).filter(Boolean)
      : [];
  if (roles.some((r) => ADMIN_ROLE_NAMES.has(String(r).toLowerCase()))) return true;
  const orgRoles = user["https://auth0.com/roles"] as unknown;
  if (Array.isArray(orgRoles) && orgRoles.some((r) => ADMIN_ROLE_NAMES.has(String(r).toLowerCase()))) {
    return true;
  }
  return false;
}
