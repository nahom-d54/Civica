"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  CheckSquare,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface AdminDashboardClientProps {
  stats: {
    totalProposals: number;
    activeProposals: number;
    totalVotes: number;
    pendingFeedback: number;
    totalUsers: number;
  };
  recentProposals: any[];
  recentFeedback: any[];
  adminRole: any;
}

export default function AdminDashboardClient({
  stats,
  recentProposals,
  recentFeedback,
  adminRole,
}: AdminDashboardClientProps) {
  const t = useTranslations();

  const statCards = [
    {
      title: t("admin.totalProposals"),
      value: stats.totalProposals,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t("admin.activeProposals"),
      value: stats.activeProposals,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t("admin.totalVotes"),
      value: stats.totalVotes,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: t("admin.pendingFeedback"),
      value: stats.pendingFeedback,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: t("admin.totalUsers"),
      value: stats.totalUsers,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("admin.dashboard")}
          </h1>
          <p className="text-gray-600 mt-1">{t("admin.welcomeBack")}</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {adminRole.role} • {adminRole.assignedRegion}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t("admin.recentProposals")}</CardTitle>
                <CardDescription>{t("admin.latestProposals")}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/proposals">{t("admin.viewAll")}</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {proposal.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {t(`voting.categories.${proposal.category}`)}
                      </Badge>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {proposal.totalVotes} {t("voting.votes")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(proposal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={
                      proposal.isActive &&
                      new Date(proposal.endsAt) > new Date()
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {proposal.isActive && new Date(proposal.endsAt) > new Date()
                      ? t("voting.active")
                      : t("voting.ended")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t("admin.recentFeedback")}</CardTitle>
                <CardDescription>{t("admin.latestFeedback")}</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/feedback">{t("admin.viewAll")}</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {feedback.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {t(`feedback.categories.${feedback.category}`)}
                      </Badge>
                      <Badge
                        className={
                          feedback.priority === "high"
                            ? "bg-red-100 text-red-800 text-xs"
                            : feedback.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800 text-xs"
                            : "bg-gray-100 text-gray-800 text-xs"
                        }
                      >
                        {t(`feedback.priorities.${feedback.priority}`)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{feedback.region}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(feedback.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={
                      feedback.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : feedback.status === "reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {t(`feedback.statuses.${feedback.status}`)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.quickActions")}</CardTitle>
          <CardDescription>{t("admin.commonTasks")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-4 flex-col space-y-2">
              <Link href="/admin/proposals/new">
                <FileText className="h-6 w-6" />
                <span>{t("admin.createProposal")}</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
            >
              <Link href="/admin/implementations">
                <CheckSquare className="h-6 w-6" />
                <span>{t("admin.updateImplementations")}</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
            >
              <Link href="/admin/analytics">
                <TrendingUp className="h-6 w-6" />
                <span>{t("admin.viewAnalytics")}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
