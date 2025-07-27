import type { ComplaintFormData } from "../validations/complaint";

export const submitComplaint = async (data: ComplaintFormData) => {
  const response = await fetch("/api/complaint", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to submit complaint");
  }
  return response.json();
};
