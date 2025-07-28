import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { proposalScopes } from "./constants";
import { proposalScopeType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkAdminRole(role: string): boolean {
  return ["admin", "superadmin"].includes(role);
}

export function checkAdminCreateProposalPermission(
  role: string,
  target: proposalScopeType | null,
  allowedScopes: proposalScopeType[] = []
): boolean {
  if (role === "superadmin") return true;
  if (role === "admin" && target) {
    return allowedScopes.includes(target);
  }
  return false;
}
