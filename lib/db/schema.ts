import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { is, relations } from "drizzle-orm";
import { user, account, verification, session } from "@/auth-schema";
import {
  voteChoices,
  priority as priorityEnum,
  statusChoices,
  implementationChoices,
  proposalCategory,
  proposalScopes,
} from "../constants";
import { proposalScopeType } from "../types";

export const proposals = pgTable("proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  createdBy: text("created_by").references(() => user.id),
  scope: varchar("scope", { enum: proposalScopes }).notNull(),
  target: varchar("target", { length: 50 }).notNull(),
  category: varchar("category", { enum: proposalCategory }).notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  isActive: boolean("is_active").default(true),
  totalVotes: integer("total_votes").default(0),
  yesVotes: integer("yes_votes").default(0),
  noVotes: integer("no_votes").default(0),
  abstainVotes: integer("abstain_votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  deletedBy: text("deleted_by").references(() => user.id),
});

export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  proposalId: uuid("proposal_id").references(() => proposals.id),
  choice: varchar("choice", { enum: voteChoices }).notNull(),
  votedAt: timestamp("voted_at").defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  category: varchar("category", { length: 50 }),
  region: varchar("region", { length: 100 }),
  woreda: varchar("woreda", { length: 100 }),
  status: varchar("status", { enum: statusChoices }).default("pending"),
  priority: varchar("priority", { enum: priorityEnum }).default("medium"),
  proposalId: uuid("proposal_id").references(() => proposals.id),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
});

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  assignedRegion: varchar("assigned_region", { length: 100 }),
  assignedZoneOrSubcity: varchar("assigned_zone_or_subcity", { length: 100 }),
  assignedWoreda: varchar("assigned_woreda", { length: 100 }),
  jobDescription: text("job_description").notNull(),
  contactInfo: text("contact_info"),
  permissions: text("permissions")
    .array()
    .$type<proposalScopeType[]>()
    .default([])
    .notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
});

export const invitation = pgTable("invitation", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: varchar("status", { length: 20 }).default("pending"),
  invitedBy: text("invited_by").references(() => user.id, {
    onDelete: "set null",
  }),
});

export const implementations = pgTable("implementations", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposalId: uuid("proposal_id").references(() => proposals.id),
  status: varchar("status", { enum: implementationChoices }).default(
    "not_started"
  ),
  progressPercentage: integer("progress_percentage").default(0),
  budgetAllocated: decimal("budget_allocated", { precision: 15, scale: 2 }),
  budgetSpent: decimal("budget_spent", { precision: 15, scale: 2 }),
  startDate: date("start_date"),
  expectedCompletion: date("expected_completion"),
  actualCompletion: date("actual_completion"),
  notes: text("notes"),
  updatedBy: text("updated_by").references(() => user.id),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
});

export const complients = pgTable("complients", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  region: varchar("region", { length: 100 }),
  zoneOrSubcity: varchar("zone_or_subcity", { length: 100 }),
  woreda: varchar("woreda", { length: 100 }),
  priority: varchar("priority", { enum: priorityEnum }).default("medium"),
  toWhom: uuid("to_whom").references(() => admins.id),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// fayda

export const fayda = pgTable("fayda", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  date_of_birth: date("date_of_birth"),
  region: varchar("region", { length: 100 }).notNull(),
  zoneOrSubcity: varchar("zone_or_subcity", { length: 100 }).notNull(),
  woreda: varchar("woreda", { length: 100 }).notNull(),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  phone_number: varchar("phone_number", { length: 20 }),
  date_of_issue: date("date_of_issue"),
  date_of_expiry: date("date_of_expiry"),
});

export const appState = pgTable("app_state", {
  id: uuid("id").primaryKey().defaultRandom(),
  installed: boolean("installed").default(false),
  installedAt: timestamp("installed_at", { mode: "date" }),
  siteName: varchar("app_name", { length: 100 }).notNull(),
  siteDescription: text("app_description"),
  appVersion: varchar("app_version", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  deletedBy: text("deleted_by").references(() => user.id),
  isActive: boolean("is_active").default(true),
  isMaintenanceMode: boolean("is_maintenance_mode").default(false),
  maintenanceMessage: text("maintenance_message"),
  maintenanceBy: text("maintenance_by").references(() => user.id),
  maintenanceCreatedAt: timestamp("maintenance_created_at").defaultNow(),
  maintenanceUpdatedAt: timestamp("maintenance_updated_at").defaultNow(),
  maintenanceIsActive: boolean("maintenance_is_active").default(false),
  maintenanceIsActiveAt: timestamp("maintenance_is_active_at").defaultNow(),
  maintenanceIsActiveUpdatedAt: timestamp(
    "maintenance_is_active_updated_at"
  ).defaultNow(),
});

// Relations
export const usersRelations = relations(user, ({ many, one }) => ({
  proposals: many(proposals),
  votes: many(votes),
  feedback: many(feedback),
  adminRoles: many(admins),
  fayda: one(fayda, {
    fields: [user.id],
    references: [fayda.userId],
  }),
}));

export const proposalsRelations = relations(proposals, ({ one, many }) => ({
  creator: one(user, {
    fields: [proposals.createdBy],
    references: [user.id],
  }),
  votes: many(votes),
  implementations: many(implementations),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(user, {
    fields: [votes.userId],
    references: [user.id],
  }),
  proposal: one(proposals, {
    fields: [votes.proposalId],
    references: [proposals.id],
  }),
  fayda: one(fayda, {
    fields: [votes.userId],
    references: [fayda.userId],
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(user, {
    fields: [feedback.userId],
    references: [user.id],
  }),
  proposal: one(proposals, {
    fields: [feedback.proposalId],
    references: [proposals.id],
  }),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(user, {
    fields: [admins.userId],
    references: [user.id],
  }),
}));

export const implementationsRelations = relations(
  implementations,
  ({ one }) => ({
    proposal: one(proposals, {
      fields: [implementations.proposalId],
      references: [proposals.id],
    }),
    updatedBy: one(user, {
      fields: [implementations.updatedBy],
      references: [user.id],
    }),
  })
);

export const complientsRelations = relations(complients, ({ one }) => ({
  user: one(user, {
    fields: [complients.userId],
    references: [user.id],
  }),
  toWhom: one(admins, {
    fields: [complients.toWhom],
    references: [admins.id],
  }),
}));

export const faydaRelations = relations(fayda, ({ one, many }) => ({
  user: one(user, {
    fields: [fayda.userId],
    references: [user.id],
  }),
  votes: many(votes),
}));

export { user, account, verification, session };
