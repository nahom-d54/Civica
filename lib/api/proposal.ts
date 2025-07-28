import { proposalSchemaType } from "../schemas";
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

export const createProposal = async (data: proposalSchemaType) => {
  const res = await fetch("/api/proposals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to create proposal");
  }
  return res.json();
};

export const updateProposal = async (id: string, data: proposalSchemaType) => {
  const res = await fetch(`/api/proposals/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to update proposal");
  }
  return res.json();
};
