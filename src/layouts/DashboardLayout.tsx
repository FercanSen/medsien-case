import { type ReactNode } from "react";
import { LayoutDashboard } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  headerAction?: ReactNode;
}

export function DashboardLayout({
  children,
  headerAction,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-muted text-text-main font-sans flex flex-col h-screen">
      <header className="bg-surface border-b border-border px-4 py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm shrink-0 z-10 gap-4 md:gap-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-primary">
            Medsien Kanban Board
          </h1>
        </div>
        {headerAction && <div className="w-full md:w-auto">{headerAction}</div>}
      </header>
      <main className="p-4 md:p-8 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
