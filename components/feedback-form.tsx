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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  feedbackSchema,
  type FeedbackFormData,
} from "@/lib/validations/feedback";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubmitFeedback } from "@/lib/query/mutations";
import { useFeedbacks, useProposalsForUser } from "@/lib/query/queries";

interface FeedbackFormProps {
  userRegion: string | undefined;
  userWoreda: string | undefined;
  proposals?: any[]; // Adjust type as needed
}

export default function FeedbackForm({
  proposals,
  userRegion,
  userWoreda,
}: FeedbackFormProps) {
  const t = useTranslations();
  const submitFeedback = useSubmitFeedback();
  const { data: recentFeedbacks } = useFeedbacks({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: "",
      message: "",
      category: undefined,
      priority: "medium",
      toProposal: "",
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);

    try {
      const responseData = await submitFeedback.mutateAsync(data);

      if (responseData) {
        toast({
          title: t("feedback.feedbackSubmitted"),
          description: t("feedback.feedbackSubmittedDesc"),
        });
        //Reset form
        form.reset();
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: t("errors.serverError"),
        description: t("errors.networkError"),
        variant: "destructive",
      });
    } finally {
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "reviewed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("feedback.title")}
        </h2>
        <p className="text-gray-600">{t("feedback.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>{t("feedback.submitFeedback")}</span>
            </CardTitle>
            <CardDescription>{t("feedback.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.title_field")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("feedback.titlePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("feedback.category")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("feedback.category")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="complaint">
                              {t("feedback.categories.complaint")}
                            </SelectItem>
                            <SelectItem value="suggestion">
                              {t("feedback.categories.suggestion")}
                            </SelectItem>
                            <SelectItem value="report">
                              {t("feedback.categories.report")}
                            </SelectItem>
                            <SelectItem value="inquiry">
                              {t("feedback.categories.inquiry")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("feedback.priority")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              {t("feedback.priorities.low")}
                            </SelectItem>
                            <SelectItem value="medium">
                              {t("feedback.priorities.medium")}
                            </SelectItem>
                            <SelectItem value="high">
                              {t("feedback.priorities.high")}
                            </SelectItem>
                            <SelectItem value="urgent">
                              {t("feedback.priorities.urgent")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/*to which proposal*/}
                <FormField
                  control={form.control}
                  name="toProposal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.proposal")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("feedback.proposal")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proposals?.map((proposal) => (
                            <SelectItem key={proposal.id} value={proposal.id}>
                              {proposal.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("feedback.messagePlaceholder")}
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>{t("feedback.location")}:</strong> {userRegion},{" "}
                    {userWoreda}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("feedback.locationNote")}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    t("feedback.sending")
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t("feedback.sendFeedback")}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>{t("feedback.recentFeedback")}</CardTitle>
            <CardDescription>{t("feedback.trackStatus")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedbacks ? (
                recentFeedbacks?.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">
                        {feedback.title}
                      </h4>
                      <div className="flex space-x-2">
                        <Badge
                          className={getPriorityColor(
                            feedback.priority || "medium"
                          )}
                        >
                          {t(`feedback.priorities.${feedback.priority}`)}
                        </Badge>
                        <Badge
                          className={getStatusColor(
                            feedback.status || "pending"
                          )}
                        >
                          {getStatusIcon(feedback.status || "pending")}
                          <span className="ml-1 capitalize">
                            {t(
                              `feedback.statuses.${
                                feedback.status || "pending"
                              }`
                            )}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="capitalize">
                        {t(`feedback.categories.${feedback.category}`)}
                      </span>
                      <span>
                        {new Date(
                          feedback.submittedAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t("feedback.noFeedback")}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
