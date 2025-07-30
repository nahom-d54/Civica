import { localeType } from "../types";
import { proposalSchemaType } from "../validations/proposal";

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
  const jsonResponse = await res.json();
  return Array.isArray(jsonResponse.proposals) ? jsonResponse.proposals : [];
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
