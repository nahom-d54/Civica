import { z } from "zod";
import { voteChoices } from "../constants";

export const voteSchema = z.object({
  proposalId: z.uuid("errors.required"),
  choice: z.enum(voteChoices),
});

export type VoteFormData = z.infer<typeof voteSchema>;
