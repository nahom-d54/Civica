export const locales = ["am-et", "en-us", "or-et", "ti-et"] as const;
export const defaultLocale = "am-et";

export const priority = ["low", "medium", "high", "urgent"] as const;
export const voteChoices = ["yes", "no", "abstain"] as const;
export const proposalCategory = [
  "infrastructure",
  "budget",
  "policy",
  "development",
] as const;
export const statusChoices = ["pending", "seen"] as const;
export const implementationChoices = [
  "not_started",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export const proposalScopes = [
  "national",
  "regional",
  "zoneOrSubcity",
  "woreda",
] as const;
