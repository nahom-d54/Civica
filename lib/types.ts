import type {
  admins,
  complients,
  fayda,
  feedback,
  implementations,
  invitation,
  proposals,
  user,
  votes,
} from "./db/schema";
import type {
  locales,
  priority,
  proposalScopes,
  voteChoices,
} from "./constants";
import type { GetStatisticsResponse } from "@/app/api/statistics/route";
import { NextResponse } from "next/server";

export type proposalSelect = typeof proposals.$inferSelect;
export type proposalInsert = typeof proposals.$inferInsert;
export type proposalScopeType = (typeof proposalScopes)[number];

export type voteSelect = typeof votes.$inferSelect;
export type voteInsert = typeof votes.$inferInsert;
export type voteUpdate = Omit<
  voteInsert,
  "proposalId" | "userId" | "id" | "votedAt"
>;

export type feedbackSelect = typeof feedback.$inferSelect;
export type feedbackInsert = typeof feedback.$inferInsert;

export type adminSelect = typeof admins.$inferSelect;
export type adminInsert = typeof admins.$inferInsert;

export type userSelect = typeof user.$inferSelect;
export type userInsert = typeof user.$inferInsert;

export type invitationSelect = typeof invitation.$inferSelect;
export type invitationInsert = typeof invitation.$inferInsert;

export type implementationSelect = typeof implementations.$inferSelect;
export type implementationInsert = typeof implementations.$inferInsert;

export type complientSelect = typeof complients.$inferSelect;
export type complientInsert = typeof complients.$inferInsert;

export type localeType = (typeof locales)[number];

export type faydaSelect = typeof fayda.$inferSelect;
export type faydaInsert = typeof fayda.$inferInsert;

export type priorityType = (typeof priority)[number];

export type voteChoiceType = (typeof voteChoices)[number];

type ExtractNextResponsePayload<T> = T extends NextResponse<infer P>
  ? P
  : never;

export type getStatisticsType = ExtractNextResponsePayload<
  Extract<GetStatisticsResponse, NextResponse<{ votes: any }>>
>;

export type adminWithUser = adminSelect & {
  user: userSelect;
};
