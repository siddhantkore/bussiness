"use client";

import { getStatusClasses } from "@/lib/utils";

interface BadgeProps {
  status: string;
  className?: string;
}

/**
 * StatusBadge – renders a colored pill badge for property/record statuses.
 * Colors are automatically derived from the status string.
 */
export function StatusBadge({ status, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClasses(status)} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "Clear" || status === "Verified" || status === "Closed" || status === "Paid"
            ? "bg-green-500"
            : status === "Under Loan" || status === "Pending" || status === "Mortgaged"
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
}
