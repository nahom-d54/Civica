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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import ProposalDialog from "@/components/proposal-dialog";

const proposalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  regionScope: z.string().min(1, "Region scope is required"),
  targetRegion: z.string().optional(),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: z.string().min(1, "End date is required"),
});

interface ProposalsManagementClientProps {
  proposals: any[];
  adminRole: any;
}

export default function ProposalsManagementClient({
  proposals,
  adminRole,
}: ProposalsManagementClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingProposal, setEditingProposal] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof proposalSchema>>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      regionScope: "national",
      targetRegion: "",
      startsAt: "",
      endsAt: "",
    },
  });

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        proposal.isActive &&
        new Date(proposal.endsAt) > new Date()) ||
      (statusFilter === "ended" &&
        (!proposal.isActive || new Date(proposal.endsAt) <= new Date()));

    const matchesCategory =
      categoryFilter === "all" || proposal.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateProposal = async (data: z.infer<typeof proposalSchema>) => {
    try {
      const response = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(t("admin.proposalCreated"));
        setIsCreateDialogOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(t("admin.errorCreatingProposal"));
      }
    } catch (error) {
      toast.error(t("admin.errorCreatingProposal"));
    }
  };

  const handleEditProposal = async (data: z.infer<typeof proposalSchema>) => {
    if (!editingProposal) return;

    try {
      const response = await fetch(
        `/api/admin/proposals/${editingProposal.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success(t("admin.proposalUpdated"));
        setIsEditDialogOpen(false);
        setEditingProposal(null);
        form.reset();
        router.refresh();
      } else {
        toast.error(t("admin.errorUpdatingProposal"));
      }
    } catch (error) {
      toast.error(t("admin.errorUpdatingProposal"));
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    if (!confirm(t("admin.confirmDeleteProposal"))) return;

    try {
      const response = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(t("admin.proposalDeleted"));
        router.refresh();
      } else {
        toast.error(t("admin.errorDeletingProposal"));
      }
    } catch (error) {
      toast.error(t("admin.errorDeletingProposal"));
    }
  };

  const handleToggleStatus = async (proposalId: string, isActive: boolean) => {
    try {
      const response = await fetch(
        `/api/admin/proposals/${proposalId}/toggle`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !isActive }),
        }
      );

      if (response.ok) {
        toast.success(t("admin.proposalStatusUpdated"));
        router.refresh();
      } else {
        toast.error(t("admin.errorUpdatingStatus"));
      }
    } catch (error) {
      toast.error(t("admin.errorUpdatingStatus"));
    }
  };

  const openEditDialog = (proposal: any) => {
    setEditingProposal(proposal);

    form.reset({
      title: proposal.title,
      description: proposal.description || "",
      category: proposal.category,
      regionScope: proposal.regionScope,
      targetRegion: proposal.targetRegion || "",
      startsAt: new Date(proposal.startsAt).toISOString().slice(0, 16),
      endsAt: new Date(proposal.endsAt).toISOString().slice(0, 16),
    });
    setIsEditDialogOpen(true);
  };

  const categories = [
    "infrastructure",
    "education",
    "healthcare",
    "environment",
    "economy",
    "governance",
  ];
  const regionScopes = ["national", "regional", "local"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("admin.proposalsManagement")}
          </h1>
          <p className="text-gray-600 mt-1">{t("admin.manageAllProposals")}</p>
        </div>
        <ProposalDialog
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          adminScope={adminRole?.permissions || []}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.filterProposals")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("admin.searchProposals")}
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
                <SelectItem value="active">{t("voting.active")}</SelectItem>
                <SelectItem value="ended">{t("voting.ended")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("admin.allCategories")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {t(`voting.categories.${category}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.proposalsList")}</CardTitle>
          <CardDescription>
            {t("admin.showingProposals", {
              count: filteredProposals.length,
              total: proposals.length,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("voting.title")}</TableHead>
                <TableHead>{t("voting.category")}</TableHead>
                <TableHead>{t("voting.region")}</TableHead>
                <TableHead>{t("voting.votes")}</TableHead>
                <TableHead>{t("voting.status")}</TableHead>
                <TableHead>{t("voting.dates")}</TableHead>
                <TableHead>{t("admin.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <>
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{proposal.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {proposal.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {t(`voting.categories.${proposal.category}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {proposal.targetRegion || proposal.regionScope}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">
                          {proposal.totalVotes}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            proposal.isActive &&
                            new Date(proposal.endsAt) > new Date()
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {proposal.isActive &&
                          new Date(proposal.endsAt) > new Date()
                            ? t("voting.active")
                            : t("voting.ended")}
                        </Badge>
                        <Switch
                          checked={proposal.isActive}
                          onCheckedChange={() =>
                            handleToggleStatus(proposal.id, proposal.isActive)
                          }
                          size="sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(proposal.startsAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(proposal.endsAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/proposal/${proposal.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(proposal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <ProposalDialog
                    proposal={proposal}
                    isCreateDialogOpen={isEditDialogOpen}
                    setIsCreateDialogOpen={setIsEditDialogOpen}
                    adminScope={adminRole?.permissions || []}
                    create={false}
                  />
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
    </div>
  );
}
