"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Users,
  CheckCircle,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { voteSchema, type VoteFormData } from "@/lib/validations/vote"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { LanguageSwitcher } from "@/components/language-switcher"

interface ProposalClientProps {
  proposal: any
  user: any
  existingVote: any
  locale: string
}

export default function ProposalClient({ proposal, user, existingVote, locale }: ProposalClientProps) {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [anonymousMode, setAnonymousMode] = useState(false)

  const form = useForm<VoteFormData>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      proposalId: proposal.id,
      choice: undefined,
    },
  })

  const onSubmit = async (data: VoteFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId: user.id,
          anonymous: anonymousMode,
        }),
      })

      if (response.ok) {
        toast({
          title: t("voting.voteSubmitted"),
          description: t("voting.voteSubmittedDesc"),
        })
        router.push(`/${locale}/proposal/${proposal.id}/results`)
      } else {
        throw new Error("Failed to submit vote")
      }
    } catch (error) {
      toast({
        title: t("errors.serverError"),
        description: t("errors.networkError"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "infrastructure":
        return <Building className="h-5 w-5" />
      case "budget":
        return <DollarSign className="h-5 w-5" />
      default:
        return <Users className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "infrastructure":
        return "bg-blue-100 text-blue-800"
      case "budget":
        return "bg-green-100 text-green-800"
      case "policy":
        return "bg-purple-100 text-purple-800"
      case "development":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
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

  const daysRemaining = getDaysRemaining(proposal.endsAt)
  const totalVotes = proposal.totalVotes || 0
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0
  const abstainPercentage = totalVotes > 0 ? (proposal.abstainVotes / totalVotes) * 100 : 0

  const isEligible = user.region === proposal.targetRegion || proposal.regionScope === "national"
  const hasVoted = !!existingVote
  const votingEnded = daysRemaining === 0

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
                <h1 className="text-lg font-semibold text-gray-900">{t("voting.title")}</h1>
                <p className="text-sm text-gray-500">{proposal.title}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Proposal Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(proposal.category)}>
                    {getCategoryIcon(proposal.category)}
                    <span className="ml-1">{t(`voting.categories.${proposal.category}`)}</span>
                  </Badge>
                  <Badge variant="outline">
                    {t(`voting.scopes.${proposal.regionScope}`)} • {proposal.targetRegion}
                  </Badge>
                  {daysRemaining > 0 ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {daysRemaining} {t("voting.daysLeft")}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">{t("voting.votingEnded")}</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{proposal.title}</CardTitle>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <div>
                  <p className="font-medium">{t("voting.ends")}</p>
                  <p>{formatDate(proposal.endsAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <div>
                  <p className="font-medium">{t("common.region")}</p>
                  <p>{proposal.targetRegion}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <div>
                  <p className="font-medium">{t("voting.votes")}</p>
                  <p>
                    {totalVotes} {t("voting.votes")}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <CardDescription className="text-base leading-relaxed mb-6">{proposal.description}</CardDescription>

            {/* Current Results Preview */}
            {totalVotes > 0 && (
              <div className="space-y-4 mb-6">
                <h4 className="font-medium">{t("voting.currentResults")}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">
                      {t("common.yes")}: {proposal.yesVotes} ({yesPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={yesPercentage} className="h-2 bg-green-100" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-700">
                      {t("common.no")}: {proposal.noVotes} ({noPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={noPercentage} className="h-2 bg-red-100" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {t("common.abstain")}: {proposal.abstainVotes} ({abstainPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={abstainPercentage} className="h-2 bg-gray-100" />
                </div>
              </div>
            )}

            {/* Eligibility Check */}
            {!isEligible && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-800">{t("voting.notEligible")}</h4>
                    <p className="text-sm text-yellow-700">
                      {t("voting.notEligibleDesc", { region: proposal.targetRegion })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Already Voted */}
            {hasVoted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">{t("voting.alreadyVoted")}</h4>
                    <p className="text-sm text-green-700">
                      {t("voting.yourVote")}: <strong>{t(`common.${existingVote.choice}`)}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Voting Form */}
            {!hasVoted && !votingEnded && isEligible && (
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium">{t("voting.castYourVote")}</h4>
                  <div className="flex items-center space-x-2">
                    {anonymousMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <Label htmlFor="anonymous-mode" className="text-sm">
                      {t("voting.anonymousMode")}
                    </Label>
                    <Switch id="anonymous-mode" checked={anonymousMode} onCheckedChange={setAnonymousMode} />
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="choice"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-green-50">
                                <RadioGroupItem value="yes" id="yes" />
                                <Label htmlFor="yes" className="flex-1 cursor-pointer">
                                  <div className="font-medium text-green-700">✅ {t("common.yes")}</div>
                                  <div className="text-sm text-gray-600">{t("voting.choices.yes")}</div>
                                </Label>
                              </div>

                              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-red-50">
                                <RadioGroupItem value="no" id="no" />
                                <Label htmlFor="no" className="flex-1 cursor-pointer">
                                  <div className="font-medium text-red-700">❌ {t("common.no")}</div>
                                  <div className="text-sm text-gray-600">{t("voting.choices.no")}</div>
                                </Label>
                              </div>

                              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                                <RadioGroupItem value="abstain" id="abstain" />
                                <Label htmlFor="abstain" className="flex-1 cursor-pointer">
                                  <div className="font-medium text-gray-700">🤷 {t("common.abstain")}</div>
                                  <div className="text-sm text-gray-600">{t("voting.choices.abstain")}</div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-4">
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? t("voting.submitting") : t("voting.submitVote")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/${locale}/proposal/${proposal.id}/results`)}
                      >
                        {t("voting.viewResults")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {/* View Results Button for completed votes */}
            {(hasVoted || votingEnded) && (
              <div className="border-t pt-6">
                <Button onClick={() => router.push(`/${locale}/proposal/${proposal.id}/results`)} className="w-full">
                  {t("voting.viewResults")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
