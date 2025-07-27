import { localeType } from "../types";

export const getProposalsForUser = async ({
  locale,
}: {
  locale: localeType;
}) => {
  const res = await fetch("/api/proposals", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch proposals");
  }
  return res.json();
};
