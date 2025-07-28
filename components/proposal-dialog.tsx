import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { AlertDialogHeader } from "./ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proposalCategory, proposalScopes } from "@/lib/constants";
import { useCreateProposal, useUpdateProposal } from "@/lib/query/mutations";
import { proposalScopeType, proposalSelect } from "@/lib/types";
import { proposalSchema, proposalSchemaType } from "@/lib/validations/proposal";

interface ProposalDialogProps {
  proposal?: proposalSelect;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  create?: boolean;
  adminScope: proposalScopeType[];
}

export default function ProposalDialog({
  proposal,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  create = false,
  adminScope,
}: ProposalDialogProps) {
  const t = useTranslations();
  const form = useForm<proposalSchemaType>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: proposal?.title || "",
      description: proposal?.description || "",
      category: proposal?.category || "development",
      scope: proposal?.scope || adminScope[0] || "regional",
      startsAt: proposal?.startsAt
        ? new Date(proposal.startsAt).toISOString().slice(0, 16)
        : "",
      endsAt: proposal?.endsAt
        ? new Date(proposal.endsAt).toISOString().slice(0, 16)
        : "",
    },
  });

  const createProposal = useCreateProposal();
  const updateProposal = useUpdateProposal(proposal?.id || "");

  const handleCreateProposal = async (data: proposalSchemaType) => {
    if (create) {
      await createProposal.mutateAsync(data);
    } else {
      await updateProposal.mutateAsync(data);
    }
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="proposal-dialog">
      <h2 className="text-xl font-bold">
        {t(`proposal.${create ? "create" : "edit"}`)}
      </h2>
      <p>{t(`proposal.${create ? "create" : "edit"}.description`)}</p>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t(`admin.${create ? "create" : "edit"}Proposal`)}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t(`admin.${create ? "create" : "edit"}Proposal`)}
            </DialogTitle>
            <DialogDescription>
              {t("admin.fillProposalDetails")}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateProposal)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("voting.title")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("voting.description")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
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
                      <FormLabel>{t("voting.category")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("voting.selectCategory")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proposalCategory.map((category) => (
                            <SelectItem key={category} value={category}>
                              {t(`voting.categories.${category}`)}
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
                  name="scope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("voting.scope")}</FormLabel>
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
                          {adminScope.map((scope) => (
                            <SelectItem key={scope} value={scope}>
                              {t(`voting.scope.${scope}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("voting.startDate")}</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endsAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("voting.endDate")}</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit">{t("admin.createProposal")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
