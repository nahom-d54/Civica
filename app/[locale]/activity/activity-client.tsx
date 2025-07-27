"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Vote,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

interface ActivityClientProps {
  user: any
  votes: any[]
  feedback: any[]
  locale: string
}

export default function ActivityClient({ user, votes, feedback, locale }: ActivityClientProps) {
  const t = useTranslations()
  const router = useRouter()

  const getVoteIcon = (choice: string) => {
    switch (choice) {
      case "yes":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "no":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "abstain":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Vote className="h-4 w-4 text-gray-600" />
    }
  }

  const getVoteColor = (choice: string) => {
    switch (choice) {
      case "yes":
        return "bg-green-100 text-green-800"
      case "no":
        return "bg-red-100 text-red-800"
      case "abstain":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "reviewed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-orange-100 text-orange-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("am-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/dashboard`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.back")}
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{t("activity.title")}</h1>
                <p className="text-sm text-gray-500">{t("activity.subtitle")}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("activity.welcome", { name: user.fullName })}</CardTitle>
            <CardDescription>
              {t("activity.summary", {
                votes: votes.length,
                feedback: feedback.length,
              })}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="votes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="votes" className="flex items-center space-x-2">
              <Vote className="h-4 w-4" />
              <span>
                {t("activity.votingHistory")} ({votes.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>
                {t("activity.feedbackHistory")} ({feedback.length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="votes" className="space-y-4">
            {votes.length > 0 ? (
              votes.map((vote) => (
                <Card key={vote.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{vote.proposal.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{vote.proposal.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {t("activity.votedOn")}: {formatDate(vote.votedAt)}
                            </span>
                          </div>
                          <Badge variant="outline">{t(`voting.categories.${vote.proposal.category}`)}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getVoteColor(vote.choice)}>
                          {getVoteIcon(vote.choice)}
                          <span className="ml-1">{t(`common.${vote.choice}`)}</span>
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/${locale}/proposal/${vote.proposal.id}/results`)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {t("activity.viewResults")}
                        </Button>
                      </div>
                    </div>

                    {/* Proposal outcome if available */}
                    {vote.proposal.totalVotes > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{t("activity.finalResults")}:</span>
                          <div className="flex space-x-4">
                            <span className="text-green-600">
                              {t("common.yes")}: {vote.proposal.yesVotes}
                            </span>
                            <span className="text-red-600">
                              {t("common.no")}: {vote.proposal.noVotes}
                            </span>
                            <span className="text-gray-600">
                              {t("common.abstain")}: {vote.proposal.abstainVotes}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("activity.noVotes")}</h3>
                  <p className="text-gray-600">{t("activity.noVotesDesc")}</p>
                  <Button className="mt-4" onClick={() => router.push(`/${locale}/dashboard`)}>
                    {t("activity.startVoting")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {feedback.length > 0 ? (
              feedback.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {t("activity.submittedOn")}: {formatDate(item.submittedAt)}
                            </span>
                          </div>
                          <Badge variant="outline">{t(`feedback.categories.${item.category}`)}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{t(`feedback.statuses.${item.status}`)}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {t(`feedback.priorities.${item.priority}`)}
                        </Badge>
                      </div>
                    </div>

                    {/* Government response if available */}
                    {item.status === "resolved" && (
                      <div className="border-t pt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="font-medium text-green-800 mb-1">{t("activity.governmentResponse")}</h4>
                          <p className="text-sm text-green-700">{t("activity.sampleResponse")}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("activity.noFeedback")}</h3>
                  <p className="text-gray-600">{t("activity.noFeedbackDesc")}</p>
                  <Button className="mt-4" onClick={() => router.push(`/${locale}/dashboard`)}>
                    {t("activity.startFeedback")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
