import { useMutation } from "@tanstack/react-query";
import type { FeedbackFormData } from "../validations/feedback";
import { submitFeedback } from "../api/feedback";
import { queryClient } from "./queryClient";
import { voteForProposal } from "../api/vote";
import { submitComplaint } from "../api/complaint";

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      // Optionally, you can invalidate queries or perform other actions on success
      queryClient.invalidateQueries({
        queryKey: ["feedbacks"],
      });
    },
  });
};

export const useSubmitVote = () => {
  return useMutation({
    mutationFn: voteForProposal,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["votes"],
      }),
  });
};

export const useSubmitComplaint = () => {
  return useMutation({
    mutationFn: submitComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["complaints"],
      });
    },
  });
};
