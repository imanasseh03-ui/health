  // 👉 STATUS COLOR FUNCTION (GLOBAL)
 export function getStatusColor(status) {
    if (status === "pending") return "secondary";
    if (status === "confirmed") return "success";
    if (status === "completed") return "dark";
    return "secondary";
  }
