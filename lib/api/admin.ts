import { adminSelect } from "../types";

export const getAdminsForUser = async (
  page = 1,
  limit = 12
): Promise<adminSelect[]> => {
  const res = await fetch(`/api/admins?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};
