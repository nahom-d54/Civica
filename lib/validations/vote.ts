import { z } from "zod";
import { voteChoices } from "../constants";

export const voteSchema = z.object({
  proposalId: z.uuid("errors.required"),
  choice: z.enum(voteChoices, "errors.invalidChoice"),
});
export const voteUpdateSchema = z.object({
  choice: z.enum(voteChoices),
});

export type voteSchemaType = z.infer<typeof voteSchema>;
export type voteUpdateSchemaType = z.infer<typeof voteUpdateSchema>;

export type VoteFormData = z.infer<typeof voteSchema>;
