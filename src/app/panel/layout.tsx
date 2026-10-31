import Link from "next/link";
import { LayoutDashboard, Gift, Users, Settings, ExternalLink } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";
import prisma from "@/lib/prisma";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
              🏪
            </div>
            <div>
              <h2 className="font-bold text-white text-base">پنل فروشگاه</h2>
              <span className="text-xs text-amber-400 font-medium">مدیریت گردونه و جوایز</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <Link
              href="/panel"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-sm font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>داشبورد و آمار</span>
            </Link>

            <Link
              href="/panel/prizes"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-sm font-medium"
            >
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>مدیریت جوایز گردونه</span>
            </Link>

            <Link
              href="/panel/customers"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-sm font-medium"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>لیست مشتریان و برندگان</span>
            </Link>

            <Link
              href="/panel/settings"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-sm font-medium"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>تنظیمات و قالب</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6">
          <LogoutButton text="خروج از پنل" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
