"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Reply,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const responseSchema = z.object({
  response: z.string().min(10, "Response must be at least 10 characters"),
  status: z.enum(["pending", "in_review", "resolved", "rejected"]),
});

interface FeedbackManagementClientProps {
  locale: string;
  adminRole: any;
}

export default function FeedbackManagementClient({
  locale,
  adminRole,
}: FeedbackManagementClientProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof responseSchema>>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: "",
      status: "in_review",
    },
  });

  // useEffect(() => {
  //   fetchFeedback();
  // }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/admin/feedback");
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof responseSchema>) => {
    if (!selectedFeedback) return;

    try {
      const response = await fetch(
        `/api/admin/feedback/${selectedFeedback.id}/respond`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            adminId: adminRole.id,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: t("admin.feedback.responseSubmitted"),
          description: t("admin.feedback.responseSubmittedDescription"),
        });
        setIsResponseDialogOpen(false);
        form.reset();
        fetchFeedback();
      } else {
        throw new Error("Failed to submit response");
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.feedback.responseError"),
        variant: "destructive",
      });
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: t("admin.feedback.statusUpdated"),
          description: t("admin.feedback.statusUpdatedDescription"),
        });
        fetchFeedback();
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("admin.feedback.statusUpdateError"),
        variant: "destructive",
      });
    }
  };

  const filteredFeedback = feedback.filter((item: any) => {
    const matchesSearch =
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            {t("admin.feedback.pending")}
          </Badge>
        );
      case "in_review":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Eye className="w-3 h-3 mr-1" />
            {t("admin.feedback.inReview")}
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("admin.feedback.resolved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            {t("admin.feedback.rejected")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">{t("admin.feedback.high")}</Badge>;
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {t("admin.feedback.medium")}
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800">
            {t("admin.feedback.low")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">{t("common.loading")}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.feedback.totalFeedback")}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedback.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.feedback.pending")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedback.filter((f: any) => f.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.feedback.resolved")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedback.filter((f: any) => f.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.feedback.avgResponseTime")}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3d</div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.feedback.feedbackManagement")}</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("admin.feedback.searchFeedback")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("admin.feedback.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="pending">
                  {t("admin.feedback.pending")}
                </SelectItem>
                <SelectItem value="in_review">
                  {t("admin.feedback.inReview")}
                </SelectItem>
                <SelectItem value="resolved">
                  {t("admin.feedback.resolved")}
                </SelectItem>
                <SelectItem value="rejected">
                  {t("admin.feedback.rejected")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue
                  placeholder={t("admin.feedback.filterByCategory")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="general">
                  {t("feedback.categories.general")}
                </SelectItem>
                <SelectItem value="technical">
                  {t("feedback.categories.technical")}
                </SelectItem>
                <SelectItem value="suggestion">
                  {t("feedback.categories.suggestion")}
                </SelectItem>
                <SelectItem value="complaint">
                  {t("feedback.categories.complaint")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.feedback.subject")}</TableHead>
                <TableHead>{t("admin.feedback.user")}</TableHead>
                <TableHead>{t("admin.feedback.category")}</TableHead>
                <TableHead>{t("admin.feedback.priority")}</TableHead>
                <TableHead>{t("admin.feedback.status")}</TableHead>
                <TableHead>{t("admin.feedback.submittedDate")}</TableHead>
                <TableHead>{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {item.subject}
                  </TableCell>
                  <TableCell>{item.user?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {t(`feedback.categories.${item.category}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFeedback(item);
                          form.setValue("status", item.status);
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        {t("admin.feedback.respond")}
                      </Button>
                      <Select
                        value={item.status}
                        onValueChange={(value) =>
                          updateFeedbackStatus(item.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            {t("admin.feedback.pending")}
                          </SelectItem>
                          <SelectItem value="in_review">
                            {t("admin.feedback.inReview")}
                          </SelectItem>
                          <SelectItem value="resolved">
                            {t("admin.feedback.resolved")}
                          </SelectItem>
                          <SelectItem value="rejected">
                            {t("admin.feedback.rejected")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog
        open={isResponseDialogOpen}
        onOpenChange={setIsResponseDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("admin.feedback.respondToFeedback")}</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">{selectedFeedback.subject}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedFeedback.message}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>
                    {t("admin.feedback.from")}: {selectedFeedback.user?.name}
                  </span>
                  <span>
                    {t("admin.feedback.category")}:{" "}
                    {t(`feedback.categories.${selectedFeedback.category}`)}
                  </span>
                  <span>
                    {t("admin.feedback.priority")}: {selectedFeedback.priority}
                  </span>
                </div>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="response"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.feedback.response")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t(
                              "admin.feedback.responsePlaceholder"
                            )}
                            rows={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("admin.feedback.updateStatus")}
                        </FormLabel>
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
                            <SelectItem value="in_review">
                              {t("admin.feedback.inReview")}
                            </SelectItem>
                            <SelectItem value="resolved">
                              {t("admin.feedback.resolved")}
                            </SelectItem>
                            <SelectItem value="rejected">
                              {t("admin.feedback.rejected")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsResponseDialogOpen(false)}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button type="submit">
                      {t("admin.feedback.submitResponse")}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
