import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell sidebar={<Sidebar />} topBar={<TopBar />}>
      {children}
    </DashboardShell>
  );
}
