"use client";

import React from "react";

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = "",
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700"
        >
          {label}
          {rest.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white
            transition-all outline-none
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}`}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  containerClassName?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  containerClassName = "",
  className = "",
  id,
  ...rest
}: SelectProps) {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
          {rest.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 bg-white
          appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")]
          bg-no-repeat bg-[right_12px_center]
          transition-all outline-none
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }
          disabled:bg-slate-50 disabled:cursor-not-allowed
          ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-800 placeholder-slate-400
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Textarea({
  label,
  error,
  containerClassName = "",
  className = "",
  id,
  ...rest
}: TextareaProps) {
  const taId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={taId} className="text-sm font-medium text-slate-700">
          {label}
          {rest.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={taId}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white
          resize-y min-h-[80px] transition-all outline-none
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }
          ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  isLoading?: boolean;
}

const variantMap = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-blue-600 shadow-sm",
  secondary:
    "bg-slate-700 text-white hover:bg-slate-800 active:bg-slate-900 border border-slate-700",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 border border-transparent",
  outline:
    "bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-300",
};

const sizeMap2 = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  isLoading,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantMap[variant]} ${sizeMap2[size]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  );
}
