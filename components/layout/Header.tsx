"use client";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  actions?: React.ReactNode;
}

/**
 * Header – top bar with page title, breadcrumb, hamburger (mobile), and action slot.
 */
export function Header({ title, subtitle, onMenuToggle, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Menu toggle + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: Actions + User */}
        <div className="flex items-center gap-3">
          {actions}

          {/* Notification bell */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* Separator */}
          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          {/* User avatar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-700 leading-tight">Admin</p>
              <p className="text-xs text-slate-400">Rev. Officer</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
