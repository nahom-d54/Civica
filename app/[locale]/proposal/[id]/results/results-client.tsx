"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Users, MapPin, MessageSquare, Calendar, CheckCircle, XCircle, Minus } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { LanguageSwitcher } from "@/components/language-switcher"

interface ResultsClientProps {
  proposal: any
  voteStats: any[]
  regionalBreakdown: any[]
  relatedFeedback: any[]
  locale: string
}

export default function ResultsClient({
  proposal,
  voteStats,
  regionalBreakdown,
  relatedFeedback,
  locale,
}: ResultsClientProps) {
  const t = useTranslations()
  const router = useRouter()

  // Process vote statistics
  const totalVotes = voteStats.reduce((sum, stat) => sum + stat.count, 0)
  const yesVotes = voteStats.find((s) => s.choice === "yes")?.count || 0
  const noVotes = voteStats.find((s) => s.choice === "no")?.count || 0
  const abstainVotes = voteStats.find((s) => s.choice === "abstain")?.count || 0

  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0
  const abstainPercentage = totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0

  // Data for charts
  const pieData = [
    { name: t("common.yes"), value: yesVotes, color: "#10B981" },
    { name: t("common.no"), value: noVotes, color: "#EF4444" },
    { name: t("common.abstain"), value: abstainVotes, color: "#6B7280" },
  ].filter((item) => item.value > 0)

  const regionalData = regionalBreakdown.map((region) => ({
    region: region.region,
    [t("common.yes")]: region.yes,
    [t("common.no")]: region.no,
    [t("common.abstain")]: region.abstain,
  }))

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("am-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const daysRemaining = getDaysRemaining(proposal.endsAt)
  const votingEnded = daysRemaining === 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/proposal/${proposal.id}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.back")}
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{t("results.title")}</h1>
                <p className="text-sm text-gray-500">{proposal.title}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Proposal Summary */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-2">{proposal.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {t("voting.ends")}: {formatDate(proposal.endsAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{proposal.targetRegion}</span>
                  </div>
                </div>
              </div>
              <Badge variant={votingEnded ? "destructive" : "default"}>
                {votingEnded ? t("voting.votingEnded") : `${daysRemaining} ${t("voting.daysLeft")}`}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Results Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("results.totalVotes")}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVotes}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("common.yes")}</p>
                  <p className="text-2xl font-bold text-green-600">{yesVotes}</p>
                  <p className="text-xs text-gray-500">{yesPercentage.toFixed(1)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("common.no")}</p>
                  <p className="text-2xl font-bold text-red-600">{noVotes}</p>
                  <p className="text-xs text-gray-500">{noPercentage.toFixed(1)}%</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("common.abstain")}</p>
                  <p className="text-2xl font-bold text-gray-600">{abstainVotes}</p>
                  <p className="text-xs text-gray-500">{abstainPercentage.toFixed(1)}%</p>
                </div>
                <Minus className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t("results.overview")}</TabsTrigger>
            <TabsTrigger value="regional">{t("results.regional")}</TabsTrigger>
            <TabsTrigger value="feedback">{t("results.feedback")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>{t("results.voteDistribution")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Progress Bars */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("results.detailedBreakdown")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-green-700">{t("common.yes")}</span>
                      <span className="text-sm font-bold text-green-700">
                        {yesVotes} ({yesPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={yesPercentage} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-red-700">{t("common.no")}</span>
                      <span className="text-sm font-bold text-red-700">
                        {noVotes} ({noPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={noPercentage} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{t("common.abstain")}</span>
                      <span className="text-sm font-bold text-gray-700">
                        {abstainVotes} ({abstainPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={abstainPercentage} className="h-3" />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t("results.totalParticipation")}</span>
                      <span className="font-bold text-lg">{totalVotes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{t("results.regionalBreakdown")}</span>
                </CardTitle>
                <CardDescription>{t("results.regionalBreakdownDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={regionalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={t("common.yes")} fill="#10B981" />
                    <Bar dataKey={t("common.no")} fill="#EF4444" />
                    <Bar dataKey={t("common.abstain")} fill="#6B7280" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {regionalBreakdown.map((region) => (
                <Card key={region.region}>
                  <CardHeader>
                    <CardTitle className="text-lg">{region.region}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">{t("common.yes")}</span>
                        <span className="font-medium">{region.yes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-700">{t("common.no")}</span>
                        <span className="font-medium">{region.no}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">{t("common.abstain")}</span>
                        <span className="font-medium">{region.abstain}</span>
                      </div>
                      <div className="pt-2 border-t flex justify-between font-semibold">
                        <span>{t("results.total")}</span>
                        <span>{region.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>{t("results.relatedFeedback")}</span>
                </CardTitle>
                <CardDescription>{t("results.relatedFeedbackDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {relatedFeedback.length > 0 ? (
                  <div className="space-y-4">
                    {relatedFeedback.map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{feedback.title}</h4>
                          <Badge variant="outline">{t(`feedback.categories.${feedback.category}`)}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{feedback.message}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{feedback.user?.fullName || t("results.anonymous")}</span>
                          <span>{new Date(feedback.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t("results.noFeedback")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard`)}>
            {t("results.backToDashboard")}
          </Button>
          <Button onClick={() => router.push(`/${locale}/feedback/new?proposal=${proposal.id}`)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("results.provideFeedback")}
          </Button>
        </div>
      </div>
    </div>
  )
}
