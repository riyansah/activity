import { Activity, BarChart3, CheckSquare, LayoutDashboard, Settings } from "lucide-react";

export const appRoutes = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Pekerjaan", icon: CheckSquare },
  { href: "/activities", label: "Aktivitas Harian", icon: Activity },
  { href: "/reports", label: "Laporan", icon: BarChart3 },
  { href: "/settings", label: "Pengaturan", icon: Settings }
];
