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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Building,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStatistics } from "@/lib/query/queries";

export default function TransparencyDashboard() {
  const t = useTranslations();

  // Mock data - in real app, this would come from API
  const votingStats = [
    { name: "Community Park", yes: 245, no: 67, abstain: 23 },
    { name: "Digital Library", yes: 189, no: 45, abstain: 12 },
    { name: "Road Maintenance", yes: 156, no: 89, abstain: 34 },
    { name: "Youth Program", yes: 203, no: 34, abstain: 18 },
  ];

  const participationData = [
    { region: "Addis Ababa", participation: 78 },
    { region: "Oromia", participation: 65 },
    { region: "Amhara", participation: 72 },
    { region: "Tigray", participation: 69 },
    { region: "SNNP", participation: 58 },
  ];

  const implementationProgress = [
    {
      id: "1",
      title: "Community Park Development",
      status: "in_progress",
      progress: 35,
      budget: 2500000,
      spent: 875000,
      startDate: "2024-01-15",
      expectedCompletion: "2024-06-30",
    },
    {
      id: "2",
      title: "Digital Library Initiative",
      status: "planned",
      progress: 0,
      budget: 1800000,
      spent: 0,
      startDate: "2024-03-01",
      expectedCompletion: "2024-12-31",
    },
    {
      id: "3",
      title: "Road Maintenance Program",
      status: "completed",
      progress: 100,
      budget: 500000,
      spent: 485000,
      startDate: "2023-11-01",
      expectedCompletion: "2024-01-31",
    },
  ];

  const { data: statistics } = useStatistics();

  const categoryData = [
    {
      name: t("voting.categories.infrastructure"),
      value:
        ((statistics?.byCategory?.find((cat) => cat.name === "infrastructure")
          ?.value || 0) *
          100) /
        (statistics?.byCategory?.reduce((acc, obj) => acc + obj.value, 0) || 1),
      color: "#3B82F6",
    },
    {
      name: t("voting.categories.budget"),
      value:
        ((statistics?.byCategory?.find((cat) => cat.name === "budget")?.value ||
          0) *
          100) /
        (statistics?.byCategory?.reduce((acc, obj) => acc + obj.value, 0) || 1),
      color: "#10B981",
    },
    {
      name: t("voting.categories.policy"),
      value:
        ((statistics?.byCategory?.find((cat) => cat.name === "policy")?.value ||
          0) *
          100) /
        (statistics?.byCategory?.reduce((acc, obj) => acc + obj.value, 0) || 1),
      color: "#8B5CF6",
    },
    {
      name: t("voting.categories.development"),
      value:
        ((statistics?.byCategory?.find((cat) => cat.name === "development")
          ?.value || 0) *
          100) /
        (statistics?.byCategory?.reduce((acc, obj) => acc + obj.value, 0) || 1),
      color: "#F59E0B",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "planned":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("transparency.title")}
        </h2>
        <p className="text-gray-600">{t("transparency.subtitle")}</p>
      </div>

      <Tabs defaultValue="voting" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="voting">
            {t("transparency.votingResults")}
          </TabsTrigger>
          <TabsTrigger value="participation">
            {t("transparency.participation")}
          </TabsTrigger>
          <TabsTrigger value="implementation">
            {t("transparency.implementation")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("transparency.proposalVotingResults")}</CardTitle>
                <CardDescription>
                  {t("transparency.voteDistribution")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics?.votes || votingStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="yes" fill="#10B981" name={t("common.yes")} />
                    <Bar dataKey="no" fill="#EF4444" name={t("common.no")} />
                    <Bar
                      dataKey="abstain"
                      fill="#6B7280"
                      name={t("common.abstain")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("transparency.proposalCategories")}</CardTitle>
                <CardDescription>
                  {t("transparency.categoryDistribution")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("transparency.totalVotesCast")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statistics?.totalVotesCast || "1,247"}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("transparency.activeVoters")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statistics?.activeVoters.count || "832"}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t("transparency.avgParticipation")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statistics?.avgParticipation.avgParticipation || "68"}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("transparency.regionalParticipation")}</CardTitle>
              <CardDescription>
                {t("transparency.participationByRegion")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics?.participation || participationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${value}%`,
                      t("transparency.participation"),
                    ]}
                  />
                  <Bar dataKey="participation" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {participationData.map((region) => (
              <Card key={region.region}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {region.participation}%
                    </span>
                  </div>
                  <Progress value={region.participation} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <div className="grid gap-6">
            {statistics?.implementations.map((project) => (
              <Card key={project.proposalId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {project.proposal?.title}
                      </CardTitle>
                      <CardDescription>
                        {t("transparency.started")}:{" "}
                        {new Date(project.startDate || "").toLocaleDateString()}{" "}
                        • {t("transparency.expectedCompletion")}:{" "}
                        {new Date(
                          project.expectedCompletion || ""
                        ).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      className={getStatusColor(
                        project.status || "not_started"
                      )}
                    >
                      {getStatusIcon(project.status || "not_started")}
                      <span className="ml-1 capitalize">
                        {t(
                          `transparency.statuses.${
                            project.status || "not_started"
                          }`
                        )}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {t("transparency.progress")}
                      </span>
                      <span className="text-sm font-medium">
                        {project.progressPercentage || 0}%
                      </span>
                    </div>
                    <Progress
                      value={project.progressPercentage || 0}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("transparency.budgetAllocated")}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {project.budgetAllocated?.toLocaleString()} ETB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("transparency.amountSpent")}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {project.budgetSpent?.toLocaleString()} ETB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>{t("transparency.budgetUtilization")}:</strong>{" "}
                      {(
                        ((Number(project.budgetSpent) || 0) /
                          (Number(project.budgetAllocated) || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                    <Progress
                      value={
                        (Number(project.budgetSpent) /
                          Number(project.budgetAllocated)) *
                        100
                      }
                      className="h-1 mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
