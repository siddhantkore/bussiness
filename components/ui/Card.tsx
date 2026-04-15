"use client";

import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  value?: string | number;
  subValue?: string;
  trend?: { value: number; label: string };
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  accent?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
}

const accentMap: Record<string, { gradient: string; icon: string; badge: string }> = {
  blue:   { gradient: "from-blue-500 to-blue-600",   icon: "bg-blue-100 text-blue-600",   badge: "text-blue-600" },
  green:  { gradient: "from-green-500 to-green-600", icon: "bg-green-100 text-green-600", badge: "text-green-600" },
  yellow: { gradient: "from-amber-500 to-orange-500",icon: "bg-amber-100 text-amber-600", badge: "text-amber-600" },
  red:    { gradient: "from-red-500 to-rose-600",    icon: "bg-red-100 text-red-600",     badge: "text-red-600" },
  purple: { gradient: "from-purple-500 to-violet-600",icon:"bg-purple-100 text-purple-600",badge:"text-purple-600"},
  indigo: { gradient: "from-indigo-500 to-indigo-600",icon:"bg-indigo-100 text-indigo-600",badge:"text-indigo-600"},
};

/**
 * Card – versatile summary card with optional icon, value, trend indicator.
 * Use `children` for custom card content.
 */
export function Card({
  title,
  subtitle,
  icon,
  value,
  subValue,
  trend,
  className = "",
  children,
  onClick,
  accent = "blue",
}: CardProps) {
  const colors = accentMap[accent];

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
        onClick ? "cursor-pointer hover:-translate-y-0.5" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children ? (
        <div className="p-5">{children}</div>
      ) : (
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {subtitle && (
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {subtitle}
                </p>
              )}
              {title && (
                <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
              )}
              {value !== undefined && (
                <p className="text-2xl font-bold text-slate-800 mt-1 leading-tight">
                  {value}
                </p>
              )}
              {subValue && (
                <p className={`text-xs mt-1 font-medium ${colors.badge}`}>{subValue}</p>
              )}
              {trend && (
                <div className="flex items-center gap-1 mt-2">
                  <span
                    className={`text-xs font-semibold ${
                      trend.value >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-slate-400">{trend.label}</span>
                </div>
              )}
            </div>
            {icon && (
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${colors.icon}`}
              >
                {icon}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
