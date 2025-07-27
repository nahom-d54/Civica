import { feedbackSelect } from "../types";
import type { FeedbackFormData } from "../validations/feedback";

export const getFeedbacks = async ({
  locale,
  page = 1,
  limit = 10,
}: {
  locale: string;
  page?: number;
  limit?: number;
}) => {
  const res = await fetch(`/api/feedback?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  });
  return res.json();
};

export const submitFeedback = async ({
  title,
  message,
  category,
  priority,
  toProposal,
}: FeedbackFormData): Promise<feedbackSelect> => {
  const res = await fetch("/api/feedback", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      message,
      category,
      priority,
      toProposal,
    }),
  });
  return res.json();
};

export const getFeedbackById = async (id: string) => {
  const res = await fetch(`/api/feedback/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch feedback");
  }
  return res.json();
};
