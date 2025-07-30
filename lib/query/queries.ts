import { useQuery } from "@tanstack/react-query";
import { getFeedbackById, getFeedbacks, submitFeedback } from "../api/feedback";
import { FeedbackFormData } from "../validations/feedback";
import { feedbackSelect, localeType } from "../types";
import { getProposalsForUser } from "../api/proposal";
import { getAdminsForUser } from "../api/admin";
import { stats } from "../api/stats";

export const useFeedbacks = ({
  locale = "am-et",
  page = 1,
  limit = 10,
}: {
  locale?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<feedbackSelect[]>({
    queryKey: ["feedbacks", page, limit],
    queryFn: () => getFeedbacks({ locale, page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useFeedbackById = (id: string) => {
  return useQuery({
    queryKey: ["feedback", id],
    queryFn: () => getFeedbackById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useComplaints = ({
  locale = "am-et",
  page = 1,
  limit = 10,
}: {
  locale?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["complaints", page, limit],
    queryFn: () => getFeedbacks({ locale, page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useProposalsForUser = ({
  locale = "am-et",
}: {
  locale?: localeType;
}) => {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: () => getProposalsForUser({ locale }), // Adjust API call as needed
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGetUserAdmins = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ["admins", page, limit],
    queryFn: () => getAdminsForUser(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useStatistics = () => {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: () => stats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
