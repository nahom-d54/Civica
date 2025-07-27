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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  type ComplaintFormData,
  complaintSchema,
} from "@/lib/validations/complaint";
import { useComplaints, useGetUserAdmins } from "@/lib/query/queries";
import { useSubmitComplaint } from "@/lib/query/mutations";

interface ComplaintFormProps {
  userRegion: string | undefined;
  userWoreda: string | undefined;
}

export default function ComplaintForm({
  userRegion,
  userWoreda,
}: ComplaintFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: recentComplaint, isLoading } = useComplaints({});
  const { mutateAsync: submitComplaint, isPending } = useSubmitComplaint();
  const { data: admins } = useGetUserAdmins();
  const { toast } = useToast();

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: "",
      message: "",
      region: "",
      woreda: "",
      zoneOrSubcity: "",
      category: "complaint",
      priority: "medium",
      toWhom: "",
    },
  });

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);

    try {
      const dataResponse = await submitComplaint(data);

      if (dataResponse) {
        toast({
          title: t("complaint.feedbackSubmitted"),
          description: t("complaint.feedbackSubmittedDesc"),
        });

        // Reset form
        form.reset();

        // Add to recent complaint (in real app, this would come from the API)
      } else {
        throw new Error("Failed to submit complaint");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: t("errors.serverError"),
        description: t("errors.networkError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          {t("complaint.title")}
        </h2>
        <p className="text-gray-600">{t("complaint.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* complaint Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>{t("complaint.submitFeedback")}</span>
            </CardTitle>
            <CardDescription>{t("complaint.description")}</CardDescription>
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
                      <FormLabel>{t("complaint.title_field")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("complaint.titlePlaceholder")}
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
                        <FormLabel>{t("complaint.category")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("complaint.category")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="complaint">
                              {t("complaint.categories.complaint")}
                            </SelectItem>
                            <SelectItem value="suggestion">
                              {t("complaint.categories.suggestion")}
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
                        <FormLabel>{t("complaint.priority")}</FormLabel>
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
                              {t("complaint.priorities.low")}
                            </SelectItem>
                            <SelectItem value="medium">
                              {t("complaint.priorities.medium")}
                            </SelectItem>
                            <SelectItem value="high">
                              {t("complaint.priorities.high")}
                            </SelectItem>
                            <SelectItem value="urgent">
                              {t("complaint.priorities.urgent")}
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
                  name="toWhom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("complaint.to_whom")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("complaint.to_whom")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {admins?.map((admin) => (
                            <SelectItem key={admin.id} value={admin.id}>
                              {admin.jobDescription}
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
                      <FormLabel>{t("complaint.message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("complaint.messagePlaceholder")}
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
                    <strong>{t("complaint.location")}:</strong> {userRegion},{" "}
                    {userWoreda}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("complaint.locationNote")}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    t("complaint.sending")
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t("complaint.sendFeedback")}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Recent complaint */}
        <Card>
          <CardHeader>
            <CardTitle>{t("complaint.recentComplaint")}</CardTitle>
            <CardDescription>{t("complaint.trackStatus")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isLoading &&
                recentComplaint?.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">
                        {complaint.title}
                      </h4>
                      <div className="flex space-x-2">
                        <Badge
                          className={getPriorityColor(
                            complaint.priority || "medium"
                          )}
                        >
                          {t(
                            `complaint.priorities.${
                              complaint.priority || "medium"
                            }`
                          )}
                        </Badge>
                        <Badge
                          className={getStatusColor(
                            complaint.status || "pending"
                          )}
                        >
                          {getStatusIcon(complaint.status || "pending")}
                          <span className="ml-1 capitalize">
                            {t(
                              `complaint.statuses.${
                                complaint.status || "pending"
                              }`
                            )}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="capitalize">
                        {t(
                          `complaint.categories.${
                            complaint.category || "complaint"
                          }`
                        )}
                      </span>
                      <span>
                        {new Date(
                          complaint.submittedAt || ""
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}

              {recentComplaint?.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t("complaint.noFeedback")}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
