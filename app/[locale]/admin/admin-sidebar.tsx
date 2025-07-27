"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  CheckSquare,
  Home,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  adminRole: any;
  locale: string;
}

export default function AdminSidebar({ adminRole, locale }: AdminSidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    {
      name: t("admin.dashboard"),
      href: `/${locale}/admin`,
      icon: Home,
      current: pathname === `/${locale}/admin`,
    },
    {
      name: t("admin.proposals"),
      href: `/${locale}/admin/proposals`,
      icon: FileText,
      current: pathname.startsWith(`/${locale}/admin/proposals`),
    },
    {
      name: t("admin.implementations"),
      href: `/${locale}/admin/implementations`,
      icon: CheckSquare,
      current: pathname.startsWith(`/${locale}/admin/implementations`),
    },
    {
      name: t("admin.users"),
      href: `/${locale}/admin/users`,
      icon: Users,
      current: pathname.startsWith(`/${locale}/admin/users`),
    },
    {
      name: t("admin.feedback"),
      href: `/${locale}/admin/feedback`,
      icon: MessageSquare,
      current: pathname.startsWith(`/${locale}/admin/feedback`),
    },
    {
      name: t("admin.analytics"),
      href: `/${locale}/admin/analytics`,
      icon: BarChart3,
      current: pathname.startsWith(`/${locale}/admin/analytics`),
    },
    {
      name: t("admin.settings"),
      href: `/${locale}/admin/settings`,
      icon: Settings,
      current: pathname.startsWith(`/${locale}/admin/settings`),
    },
  ];

  return (
    <div
      className={cn(
        "bg-white shadow-lg transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Civica Admin
            </h2>
            <Badge variant="secondary" className="mt-1">
              {adminRole.role} • {adminRole.assignedRegion}
            </Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  item.current
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 h-5 w-5",
                    isCollapsed ? "mr-0" : "mr-3"
                  )}
                />
                {!isCollapsed && item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
