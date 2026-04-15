"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/FormControls";
import {
  properties,
  encumbrances,
  incomeRecords,
  dashboardStats,
} from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

// ─── Mini stat card for property distribution ─────────────────────────────────
function DistributionBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-500">
          {count} ({pct}%)
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Activity item ────────────────────────────────────────────────────────────
function ActivityItem({
  icon,
  title,
  detail,
  time,
  type,
}: {
  icon: string;
  title: string;
  detail: string;
  time: string;
  type: "success" | "warning" | "danger" | "info";
}) {
  const dotColor = {
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger:  "bg-red-500",
    info:    "bg-blue-500",
  }[type];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{detail}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="text-xs text-slate-400">{time}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const total = dashboardStats.totalProperties;

  // Recent properties — last 3
  const recentProperties = [...properties]
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 3);

  // Active encumbrances
  const activeEnc = encumbrances.filter((e) => e.status === "Active").slice(0, 3);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Land Ownership Information System — Overview"
    >
      {/* ── Summary Stats Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card
          subtitle="Total Properties"
          value={dashboardStats.totalProperties}
          subValue="Across all districts"
          accent="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <Card
          subtitle="Total Market Value"
          value={formatCurrency(dashboardStats.totalMarketValue)}
          subValue="Registered + unregistered"
          accent="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <Card
          subtitle="Loan Outstanding"
          value={formatCurrency(dashboardStats.totalLoanOutstanding)}
          subValue={`${dashboardStats.activeEncumbrances} active loans`}
          accent="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
        />
        <Card
          subtitle="Monthly Income"
          value={formatCurrency(dashboardStats.totalMonthlyIncome)}
          subValue="From rentals & leases"
          accent="indigo"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* ── Middle Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Property Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700">Property Status</h2>
            <Link href="/properties" className="text-xs text-blue-600 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            <DistributionBar
              label="Clear Title"
              count={dashboardStats.clearProperties}
              total={total}
              color="bg-green-500"
            />
            <DistributionBar
              label="Under Loan"
              count={dashboardStats.underLoanProperties}
              total={total}
              color="bg-amber-500"
            />
            <DistributionBar
              label="Mortgaged"
              count={dashboardStats.mortgagedProperties}
              total={total}
              color="bg-orange-500"
            />
            <DistributionBar
              label="Disputed"
              count={dashboardStats.disputedProperties}
              total={total}
              color="bg-red-500"
            />
          </div>

          {/* Legend pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {[
              { label: "Clear", color: "bg-green-500" },
              { label: "Loan", color: "bg-amber-500" },
              { label: "Mortgaged", color: "bg-orange-500" },
              { label: "Disputed", color: "bg-red-500" },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700">Recent Properties</h2>
            <Link href="/properties" className="text-xs text-blue-600 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Property ID", "Owner", "Location", "Type", "Status", "Value"].map((h) => (
                    <th key={h} className="pb-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                        {p.id}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-700 font-medium text-xs whitespace-nowrap">
                      {p.ownerName}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500 whitespace-nowrap">
                      {p.village}, {p.district}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500">{p.landType}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">
                      {formatCurrency(p.marketValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Active Loans */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700">Active Encumbrances</h2>
            <Link href="/encumbrances" className="text-xs text-blue-600 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {activeEnc.map((enc) => {
              const prop = properties.find((p) => p.id === enc.propertyId);
              const pct =
                enc.principal > 0
                  ? Math.round((enc.outstandingAmount / enc.principal) * 100)
                  : 0;
              return (
                <div key={enc.id} className="rounded-xl border border-slate-100 p-3.5 hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{enc.lenderName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {prop?.ownerName} · {enc.loanType}
                      </p>
                    </div>
                    <StatusBadge status={enc.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Outstanding</span>
                    <span className="font-semibold text-slate-700">
                      {formatCurrency(enc.outstandingAmount)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pct}% of principal remaining</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-700">Income Details</h2>
            <Link href="/income" className="text-xs text-blue-600 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {incomeRecords.map((inc) => {
              const prop = properties.find((p) => p.id === inc.propertyId);
              return (
                <div
                  key={inc.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      {inc.incomeType === "Rental" || inc.incomeType === "Lease"
                        ? "🏠"
                        : inc.incomeType === "Agricultural Yield"
                        ? "🌾"
                        : "🏢"}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{inc.incomeType}</p>
                      <p className="text-xs text-slate-400">{prop?.village} · {inc.tenant}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {formatCurrency(inc.amount)}
                    </p>
                    <StatusBadge status={inc.paymentStatus} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick totals */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Paid", count: incomeRecords.filter(i => i.paymentStatus === "Paid").length, color: "text-green-600" },
              { label: "Pending", count: incomeRecords.filter(i => i.paymentStatus === "Pending").length, color: "text-amber-600" },
              { label: "Overdue", count: incomeRecords.filter(i => i.paymentStatus === "Overdue").length, color: "text-red-600" },
            ].map(({ label, count, color }) => (
              <div key={label} className="rounded-lg bg-slate-50 py-2">
                <p className={`text-lg font-bold ${color}`}>{count}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
