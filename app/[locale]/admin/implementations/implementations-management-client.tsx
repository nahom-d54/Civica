"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  implementationSchema,
  type implementationSchemaType,
} from "@/lib/validations/implimentation";
import { implementationChoices } from "@/lib/constants";

interface ImplementationsManagementClientProps {
  implementations: any[];
  proposalsWithoutImplementations: any[];
  adminRole: any;
}

export default function ImplementationsManagementClient({
  implementations,
  proposalsWithoutImplementations,
  adminRole,
}: ImplementationsManagementClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingImplementation, setEditingImplementation] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<implementationSchemaType>({
    resolver: zodResolver(implementationSchema),
    defaultValues: {
      proposalId: "",
      status: "not_started",
      progressPercentage: 0,
      budgetAllocated: 0,
      budgetSpent: 0,
      startDate: new Date(),
      expectedCompletion: new Date(),
      notes: "",
    },
  });

  const filteredImplementations = implementations.filter((implementation) => {
    const matchesSearch =
      implementation.proposal?.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      implementation.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || implementation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateImplementation = async (
    data: z.infer<typeof implementationSchema>
  ) => {
    try {
      const response = await fetch("/api/implementations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          progressPercentage: Number(data.progressPercentage),
        }),
      });

      if (response.ok) {
        toast.success(t("admin.implementationCreated"));
        setIsCreateDialogOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(t("admin.errorCreatingImplementation"));
      }
    } catch (error) {
      toast.error(t("admin.errorCreatingImplementation"));
    }
  };

  const handleEditImplementation = async (data: implementationSchemaType) => {
    if (!editingImplementation) return;

    try {
      const response = await fetch(
        `/api/implementations/${editingImplementation.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            progressPercentage: Number(data.progressPercentage),
          }),
        }
      );

      if (response.ok) {
        toast.success(t("admin.implementationUpdated"));
        setIsEditDialogOpen(false);
        setEditingImplementation(null);
        form.reset();
        router.refresh();
      } else {
        toast.error(t("admin.errorUpdatingImplementation"));
      }
    } catch (error) {
      toast.error(t("admin.errorUpdatingImplementation"));
    }
  };

  const openEditDialog = (implementation: any) => {
    setEditingImplementation(implementation);
    form.reset({
      proposalId: implementation.proposalId,
      status: implementation.status || "in_progress",
      progressPercentage: Number(implementation.progressPercentage) || 0,
      budgetAllocated: Number(implementation.budgetAllocated) || 0,
      budgetSpent: Number(implementation.budgetSpent) || 0,
      startDate: implementation.startDate
        ? new Date(implementation.startDate)
        : new Date(),
      expectedCompletion: implementation.expectedCompletion
        ? new Date(implementation.expectedCompletion)
        : new Date(),
      actualCompletion: implementation.actualCompletion
        ? new Date(implementation.actualCompletion)
        : undefined,
      notes: implementation.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const statuses = implementationChoices;
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("admin.implementationsManagement")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("admin.trackProjectProgress")}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.createImplementation")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("admin.createNewImplementation")}</DialogTitle>
              <DialogDescription>
                {t("admin.fillImplementationDetails")}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateImplementation)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="proposalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.selectProposal")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("admin.selectProposal")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proposalsWithoutImplementations.map((proposal) => (
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.status")}</FormLabel>
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
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {t(`admin.implementationStatuses.${status}`)}
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
                    name="progressPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.progressPercentage")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budgetAllocated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.budgetAllocated")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budgetSpent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.budgetSpent")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.startDate")}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? new Date(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedCompletion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.expectedCompletion")}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? new Date(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="actualCompletion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.actualCompletion")}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? new Date(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.notes")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit">
                    {t("admin.createImplementation")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("admin.totalImplementations")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {implementations.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("admin.inProgress")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    implementations.filter((i) => i.status === "in-progress")
                      .length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("admin.completed")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    implementations.filter((i) => i.status === "completed")
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("admin.totalBudget")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {implementations
                    .reduce(
                      (sum, i) => sum + (Number(i.budgetAllocated) || 0),
                      0
                    )
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.filterImplementations")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("admin.searchImplementations")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.allStatuses")}</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`admin.implementationStatuses.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Implementations Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.implementationsList")}</CardTitle>
          <CardDescription>
            {t("admin.showingImplementations", {
              count: filteredImplementations.length,
              total: implementations.length,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.proposal")}</TableHead>
                <TableHead>{t("admin.status")}</TableHead>
                <TableHead>{t("admin.progress")}</TableHead>
                <TableHead>{t("admin.budget")}</TableHead>
                <TableHead>{t("admin.timeline")}</TableHead>
                <TableHead>{t("admin.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImplementations.map((implementation) => (
                <TableRow key={implementation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {implementation.proposal?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t(
                          `voting.categories.${implementation.proposal?.category}`
                        )}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(implementation.status)}
                      <Badge className={getStatusColor(implementation.status)}>
                        {t(
                          `admin.implementationStatuses.${implementation.status}`
                        )}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{implementation.progressPercentage || 0}%</span>
                      </div>
                      <Progress
                        value={implementation.progressPercentage || 0}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {implementation.budgetAllocated && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          <span>
                            $
                            {Number(
                              implementation.budgetAllocated
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {implementation.budgetSpent && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <span className="text-xs">
                            Spent: $
                            {Number(
                              implementation.budgetSpent
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {implementation.startDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(
                              implementation.startDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {implementation.expectedCompletion && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Est:{" "}
                            {new Date(
                              implementation.expectedCompletion
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(implementation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("admin.editImplementation")}</DialogTitle>
            <DialogDescription>
              {t("admin.updateImplementationDetails")}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEditImplementation)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.status")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {t(`admin.implementationStatuses.${status}`)}
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
                  name="progressPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.progressPercentage")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budgetAllocated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.budgetAllocated")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budgetSpent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.budgetSpent")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.startDate")}</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedCompletion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.expectedCompletion")}</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="actualCompletion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.actualCompletion")}</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.notes")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit">{t("admin.updateImplementation")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
