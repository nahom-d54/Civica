"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  CheckCircle,
  MapPin,
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
  FormDescription,
} from "@/components/ui/form";
import { LanguageSwitcher } from "@/components/language-switcher";

interface FeedbackNewClientProps {
  user: any;
  proposal: any;
  locale: string;
}

export default function FeedbackNewClient({
  user,
  proposal,
  locale,
}: FeedbackNewClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: "",
      message: "",
      category: "suggestion",
      priority: "medium",
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...data,
          region: user.region,
          woreda: user.woreda,
          proposalId: proposal?.id || null,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: t("feedback.feedbackSubmitted"),
          description: t("feedback.feedbackSubmittedDesc"),
        });
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      toast({
        title: t("errors.serverError"),
        description: t("errors.networkError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("feedbackNew.success.title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("feedbackNew.success.message")}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push(`/${locale}/activity`)}
                className="w-full"
              >
                {t("feedbackNew.success.viewActivity")}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/${locale}/dashboard`)}
                className="w-full"
              >
                {t("feedbackNew.success.backToDashboard")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/${locale}/dashboard`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.back")}
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {t("feedbackNew.title")}
                </h1>
                <p className="text-sm text-gray-500">
                  {t("feedbackNew.subtitle")}
                </p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Related Proposal */}
        {proposal && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>{t("feedbackNew.relatedProposal")}</span>
              </CardTitle>
              <CardDescription>
                {t("feedbackNew.relatedProposalDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-2">{proposal.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {proposal.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">
                    {t(`voting.categories.${proposal.category}`)}
                  </Badge>
                  <Badge variant="outline">{proposal.targetRegion}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>{t("feedbackNew.formTitle")}</span>
            </CardTitle>
            <CardDescription>
              {t("feedbackNew.formDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.title_field")} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("feedbackNew.titlePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("feedbackNew.titleDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("feedback.category")} *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("feedbackNew.selectCategory")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="complaint">
                              <div className="flex items-center space-x-2">
                                <span>📢</span>
                                <span>
                                  {t("feedback.categories.complaint")}
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="suggestion">
                              <div className="flex items-center space-x-2">
                                <span>💡</span>
                                <span>
                                  {t("feedback.categories.suggestion")}
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="report">
                              <div className="flex items-center space-x-2">
                                <span>⚠️</span>
                                <span>{t("feedback.categories.report")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="inquiry">
                              <div className="flex items-center space-x-2">
                                <span>❓</span>
                                <span>{t("feedback.categories.inquiry")}</span>
                              </div>
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
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span>{t("feedback.priorities.low")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>{t("feedback.priorities.medium")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                <span>{t("feedback.priorities.high")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="urgent">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <span>{t("feedback.priorities.urgent")}</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.message")} *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("feedbackNew.messagePlaceholder")}
                          rows={8}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("feedbackNew.messageDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location Info */}
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium text-gray-900">
                      {t("feedback.location")}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>{t("dashboard.userInfo.region")}:</strong>{" "}
                    {user.region}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>{t("dashboard.userInfo.woreda")}:</strong>{" "}
                    {user.woreda}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("feedbackNew.locationNote")}
                  </p>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" required />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("feedbackNew.agreeToTerms")}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {t("feedbackNew.termsDescription")}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      t("feedback.sending")
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t("feedbackNew.submitFeedback")}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/${locale}/dashboard`)}
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
