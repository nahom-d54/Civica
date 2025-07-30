"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Vote,
  MessageSquare,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import VotingInterface from "@/components/voting-interface";
import FeedbackForm from "@/components/feedback-form";
import AdminPanel from "@/components/admin-panel";
import TransparencyDashboard from "@/components/transparency-dashboard";
import { LanguageSwitcher } from "@/components/language-switcher";
import type {
  faydaSelect,
  feedbackSelect,
  localeType,
  proposalSelect,
  userSelect,
  voteSelect,
} from "@/lib/types";
import ComplaintForm from "@/components/complaint-form";
import { authClient } from "@/lib/auth-client";

interface DashboardClientProps {
  user: userSelect;
  proposals: proposalSelect[];
  userVotes: voteSelect[];
  recentFeedback: feedbackSelect[];
  locale: localeType;
  fayda?: faydaSelect;
}

export default function DashboardClient({
  user,
  proposals,
  userVotes,
  recentFeedback,
  locale,
  fayda,
}: DashboardClientProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("vote");
  const router = useRouter();

  const votedProposalIds = new Set(userVotes.map((vote) => vote.proposalId));

  const stats = {
    totalProposals: proposals.length,
    votedProposals: userVotes.length,
    pendingVotes: proposals.filter((p) => !votedProposalIds.has(p.id)).length,
    feedbackSubmitted: recentFeedback.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t("dashboard.title")}
                </h1>
                <p className="text-sm text-gray-500">
                  {t("dashboard.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="text-right">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {fayda?.region}, {fayda?.zoneOrSubcity}, {fayda?.woreda}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  authClient.signOut();
                  router.push(`/${locale}`);
                }}
              >
                {t("auth.signOut")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t("dashboard.stats.activeProposals")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProposals}
                  </p>
                </div>
                <Vote className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t("dashboard.stats.yourVotes")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.votedProposals}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t("dashboard.stats.pendingVotes")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingVotes}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t("dashboard.stats.feedbackSent")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.feedbackSubmitted}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vote" className="flex items-center space-x-2">
              <Vote className="h-4 w-4" />
              <span>{t("navigation.vote")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{t("navigation.feedback")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="transparency"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>{t("navigation.transparency")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="complaints"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>{t("navigation.complaints")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vote">
            <VotingInterface
              proposals={proposals || []}
              userVotes={userVotes}
            />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackForm
              proposals={proposals}
              userRegion={fayda?.region}
              userWoreda={fayda?.woreda}
            />
          </TabsContent>

          <TabsContent value="transparency">
            <TransparencyDashboard />
          </TabsContent>

          <TabsContent value="complaints">
            <ComplaintForm
              userRegion={fayda?.region}
              userWoreda={fayda?.woreda}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
