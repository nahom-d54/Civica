import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkAdminRole(role: string): boolean {
  return ["admin", "superadmin"].includes(role);
}
