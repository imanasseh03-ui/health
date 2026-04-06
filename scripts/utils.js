// Map appointment status values to Bootstrap color names.
export function getStatusColor(status) {
  if (status === "pending") return "secondary";
  if (status === "confirmed") return "success";
  if (status === "completed") return "dark";
  return "secondary";
}
