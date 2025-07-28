import { voteInsert, voteUpdate } from "../types";

export const voteForProposal = async (data: voteInsert) => {
  const dataResponse = await fetch("/api/vote", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });

  return dataResponse.json();
};

export const getMyVotes = async (page = 1, limit = 12) => {
  const dataResponse = await fetch(`/api/vote/my?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });

  return dataResponse.json();
};

export const updateVote = async (id: string, data: voteUpdate) => {
  const dataResponse = await fetch(`/api/vote/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    credentials: "include",
  });

  return dataResponse.json();
};
