import Link from "next/link";
import { Store, BarChart3, Sparkles } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

export default function AdminLayout({
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
              👑
            </div>
            <div>
              <h2 className="font-bold text-white text-base">سوپر ادمین</h2>
              <span className="text-xs text-amber-400 font-medium">مدیریت کل سیستم</span>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white transition-all text-sm font-medium"
            >
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>داشبورد و آمار</span>
            </Link>

            <Link
              href="/admin/stores"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all text-sm font-medium"
            >
              <Store className="w-5 h-5 text-orange-400" />
              <span>مدیریت فروشگاه‌ها</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
