"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Users,
  CheckCircle,
  Calendar,
  TrendingUp,
  Building,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { voteSchema, type VoteFormData } from "@/lib/validations/vote";
import { proposalSelect, voteChoiceType, voteSelect } from "@/lib/types";
import { useSubmitVote } from "@/lib/query/mutations";

interface VotingInterfaceProps {
  proposals: proposalSelect[];
  userVotes: voteSelect[];
}

export default function VotingInterface({
  proposals,
  userVotes,
}: VotingInterfaceProps) {
  const t = useTranslations();
  const {
    mutateAsync: submitVote,
    isError,
    isSuccess,
    error,
    isPending,
  } = useSubmitVote();
  const { toast } = useToast();

  const votedProposalIds = new Set(userVotes.map((vote) => vote.proposalId));

  const form = useForm<VoteFormData>({
    resolver: zodResolver(voteSchema),
  });

  const handleSubmitVote = async (data: VoteFormData) => {
    try {
      const dataResponse = await submitVote(data);

      if (dataResponse) {
        toast({
          title: t("voting.voteSubmitted"),
          description: t("voting.voteSubmittedDesc"),
        });
        // Refresh the page to update the UI
        window.location.reload();
      } else {
        throw new Error("Failed to submit vote");
      }
    } catch (error) {
      toast({
        title: t("errors.serverError"),
        description: t("errors.networkError"),
        variant: "destructive",
      });
    } finally {
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "infrastructure":
        return <Building className="h-4 w-4" />;
      case "budget":
        return <DollarSign className="h-4 w-4" />;
      case "policy":
        return <Users className="h-4 w-4" />;
      case "development":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "infrastructure":
        return "bg-blue-100 text-blue-800";
      case "budget":
        return "bg-green-100 text-green-800";
      case "policy":
        return "bg-purple-100 text-purple-800";
      case "development":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("am-ET", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (endDate: string | Date) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("voting.title")}
          </h2>
          <p className="text-gray-600">{t("voting.subtitle")}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {proposals.length} {t("voting.activeProposals")}
        </Badge>
      </div>

      <div className="grid gap-6">
        {proposals?.map((proposal) => {
          const hasVoted = votedProposalIds.has(proposal.id);
          const userVote = userVotes.find(
            (vote) => vote.proposalId === proposal.id
          );
          const daysRemaining = getDaysRemaining(proposal.endsAt);
          const totalVotes = proposal.totalVotes || 0;
          const yesPercentage =
            totalVotes > 0 ? (proposal.yesVotes || 0 / totalVotes) * 100 : 0;
          const noPercentage =
            totalVotes > 0 ? (proposal.noVotes || 0 / totalVotes) * 100 : 0;

          return (
            <Card
              key={proposal.id}
              className={hasVoted ? "border-green-200 bg-green-50" : ""}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getCategoryColor(
                          proposal.category || "complaint"
                        )}
                      >
                        {getCategoryIcon(proposal.category || "complaint")}
                        <span className="ml-1 capitalize">
                          {t(`voting.categories.${proposal.category}`)}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t(`voting.scopes.${proposal.scope}`)} •{" "}
                        {proposal.target}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{proposal.title}</CardTitle>
                    <CardDescription className="text-base">
                      {proposal.description}
                    </CardDescription>
                  </div>
                  {hasVoted && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t("voting.alreadyVoted")}:{" "}
                      {t(`common.${userVote?.choice}`)}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {t("voting.ends")} {formatDate(proposal.endsAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {daysRemaining} {t("voting.daysLeft")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {totalVotes} {t("voting.votes")}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Voting Results Preview */}
                {totalVotes > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {t("common.yes")}: {proposal.yesVotes} (
                        {yesPercentage.toFixed(1)}%)
                      </span>
                      <span>
                        {t("common.no")}: {proposal.noVotes} (
                        {noPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className="bg-green-500 h-2 rounded-l"
                        style={{ width: `${yesPercentage}%` }}
                      />
                      <div
                        className="bg-red-500 h-2 rounded-r"
                        style={{ width: `${noPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Voting Interface */}
                {!hasVoted && daysRemaining > 0 ? (
                  <VoteForm
                    proposalId={proposal.id}
                    onSubmit={handleSubmitVote}
                    isSubmitting={isPending}
                  />
                ) : hasVoted ? (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {t("voting.alreadyVoted")}:{" "}
                        {t(`common.${userVote?.choice}`)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {t("voting.thankYou")}
                    </p>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">
                        {t("voting.votingEnded")}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {proposals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("voting.noActiveProposals")}
            </h3>
            <p className="text-gray-600">{t("voting.noActiveProposalsDesc")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function VoteForm({
  proposalId,
  onSubmit,
  isSubmitting,
}: {
  proposalId: string;
  onSubmit: ({ proposalId, choice }: VoteFormData) => void;
  isSubmitting: boolean;
}) {
  const t = useTranslations();
  const [selectedChoice, setSelectedChoice] =
    useState<voteChoiceType>("abstain");

  const handleSubmit = () => {
    if (selectedChoice) {
      onSubmit({ proposalId, choice: selectedChoice });
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="font-medium">{t("voting.castYourVote")}</h4>
      <RadioGroup
        value={selectedChoice}
        onValueChange={(val: string) =>
          setSelectedChoice(val as voteChoiceType)
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`yes-${proposalId}`} />
          <Label
            htmlFor={`yes-${proposalId}`}
            className="text-green-700 font-medium"
          >
            {t("voting.choices.yes")}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`no-${proposalId}`} />
          <Label
            htmlFor={`no-${proposalId}`}
            className="text-red-700 font-medium"
          >
            {t("voting.choices.no")}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="abstain" id={`abstain-${proposalId}`} />
          <Label
            htmlFor={`abstain-${proposalId}`}
            className="text-gray-700 font-medium"
          >
            {t("voting.choices.abstain")}
          </Label>
        </div>
      </RadioGroup>
      <Button
        onClick={handleSubmit}
        disabled={!selectedChoice || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? t("voting.submitting") : t("voting.submitVote")}
      </Button>
    </div>
  );
}
