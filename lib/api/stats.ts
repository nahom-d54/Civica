import { getStatisticsType } from "../types";

export const stats = async (): Promise<getStatisticsType> => {
  const res = await fetch(`/api/statistics`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};
