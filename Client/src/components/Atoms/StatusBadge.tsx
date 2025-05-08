import { Badge } from "@/components/ui/badge";
import React from "react";

interface StatusBadgeProps {
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

const statusColor = {
  confirmed: "text-green-600",
  cancelled: "text-red-600",
  completed: "text-blue-600",
  pending: "text-yellow-600",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <Badge variant="outline" className={`capitalize ${statusColor[status]}`}>
    {status}
  </Badge>
); 