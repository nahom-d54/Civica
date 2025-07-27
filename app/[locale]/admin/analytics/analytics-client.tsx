"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Vote,
  MessageSquare,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChartIcon,
  Activity,
} from "lucide-react";

interface AnalyticsClientProps {
  locale: string;
  adminRole: any;
}

export default function AnalyticsClient({
  locale,
  adminRole,
}: AnalyticsClientProps) {
  const t = useTranslations();
  const [analytics, setAnalytics] = useState<any>({});
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `/api/admin/analytics?timeRange=${timeRange}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const votingTrendData = [
    { month: "Jan", votes: 1200, proposals: 15 },
    { month: "Feb", votes: 1800, proposals: 22 },
    { month: "Mar", votes: 2400, proposals: 18 },
    { month: "Apr", votes: 2200, proposals: 25 },
    { month: "May", votes: 3200, proposals: 30 },
    { month: "Jun", votes: 2800, proposals: 28 },
  ];

  const participationData = [
    { region: "Addis Ababa", participation: 85 },
    { region: "Oromia", participation: 72 },
    { region: "Amhara", participation: 68 },
    { region: "Tigray", participation: 65 },
    { region: "SNNP", participation: 70 },
    { region: "Somali", participation: 58 },
  ];

  const proposalStatusData = [
    { name: "Active", value: 45, color: "#10B981" },
    { name: "Completed", value: 32, color: "#3B82F6" },
    { name: "Pending", value: 18, color: "#F59E0B" },
    { name: "Rejected", value: 5, color: "#EF4444" },
  ];

  const feedbackCategoryData = [
    { category: "General", count: 245 },
    { category: "Technical", count: 156 },
    { category: "Suggestion", count: 189 },
    { category: "Complaint", count: 98 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-8">{t("common.loading")}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-500" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">
                {t("admin.analytics.last7Days")}
              </SelectItem>
              <SelectItem value="30d">
                {t("admin.analytics.last30Days")}
              </SelectItem>
              <SelectItem value="90d">
                {t("admin.analytics.last90Days")}
              </SelectItem>
              <SelectItem value="1y">
                {t("admin.analytics.lastYear")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.analytics.totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span>{" "}
              {t("admin.analytics.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.analytics.totalVotes")}
            </CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span>{" "}
              {t("admin.analytics.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.analytics.activeProposals")}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+5</span>{" "}
              {t("admin.analytics.newThisWeek")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.analytics.avgParticipation")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span>{" "}
              {t("admin.analytics.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              {t("admin.analytics.votingTrends")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                votes: {
                  label: t("admin.analytics.votes"),
                  color: "hsl(var(--chart-1))",
                },
                proposals: {
                  label: t("admin.analytics.proposals"),
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={votingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="votes"
                    stroke="var(--color-votes)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="proposals"
                    stroke="var(--color-proposals)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              {t("admin.analytics.regionalParticipation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                participation: {
                  label: t("admin.analytics.participation"),
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="participation"
                    fill="var(--color-participation)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              {t("admin.analytics.proposalStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                active: {
                  label: t("admin.analytics.active"),
                  color: "#10B981",
                },
                completed: {
                  label: t("admin.analytics.completed"),
                  color: "#3B82F6",
                },
                pending: {
                  label: t("admin.analytics.pending"),
                  color: "#F59E0B",
                },
                rejected: {
                  label: t("admin.analytics.rejected"),
                  color: "#EF4444",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={proposalStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {proposalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              {t("admin.analytics.feedbackCategories")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: t("admin.analytics.count"),
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feedbackCategoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.analytics.topPerformingProposals")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Digital ID Integration",
                  votes: 2543,
                  engagement: 89,
                },
                {
                  title: "Public Transport Reform",
                  votes: 2234,
                  engagement: 85,
                },
                {
                  title: "Healthcare Accessibility",
                  votes: 1987,
                  engagement: 82,
                },
                { title: "Education Funding", votes: 1876, engagement: 78 },
              ].map((proposal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{proposal.title}</p>
                    <p className="text-xs text-gray-600">
                      {proposal.votes} votes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {proposal.engagement}%
                    </p>
                    <p className="text-xs text-gray-600">
                      {t("admin.analytics.engagement")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.analytics.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "New proposal created",
                  user: "Admin User",
                  time: "2 hours ago",
                },
                {
                  action: "Voting completed",
                  user: "System",
                  time: "4 hours ago",
                },
                {
                  action: "Feedback responded",
                  user: "Regional Admin",
                  time: "6 hours ago",
                },
                {
                  action: "User registered",
                  user: "New Citizen",
                  time: "8 hours ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.analytics.systemHealth")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {t("admin.analytics.serverUptime")}
                </span>
                <span className="text-sm font-medium text-green-600">
                  99.9%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {t("admin.analytics.avgResponseTime")}
                </span>
                <span className="text-sm font-medium">245ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {t("admin.analytics.activeUsers")}
                </span>
                <span className="text-sm font-medium">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {t("admin.analytics.errorRate")}
                </span>
                <span className="text-sm font-medium text-green-600">
                  0.02%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
