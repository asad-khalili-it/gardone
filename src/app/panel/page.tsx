"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Users, Trophy, ExternalLink } from "lucide-react";
import QRCodeCard from "@/components/panel/QRCodeCard";

export default function PanelDashboardPage() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In actual session, store data comes from auth session or settings API
    fetch("/api/panel/settings")
      .then((res) => res.json())
      .then((data) => {
        setStore(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">داشبورد فروشگاه</h1>
          <p className="text-slate-400 text-sm mt-1">مشاهده بازدهی گردونه شانس و مشارکت مشتریان</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={store?.slug ? `/${store.slug}` : "#"}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 font-bold transition-all text-sm"
          >
            <span>مشاهده صفحه گردونه</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">کل چرخش‌ها</p>
              <h3 className="text-3xl font-black text-white mt-2">{store?.entriesCount || 0}</h3>
              <p className="text-xs text-emerald-400 mt-2 font-medium">مشتریان جذب‌شده</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">جوایز فعال</p>
              <h3 className="text-3xl font-black text-white mt-2">{store?.prizesCount || 0}</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">گزینه‌های روی گردونه</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Gift className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">وضعیت گردونه</p>
              <h3 className="text-2xl font-black text-white mt-2">
                {store?.isActive ? "🟢 فعال و آماده" : "🔴 غیرفعال"}
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                قابل تغییر از بخش تنظیمات
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Banner */}
      <QRCodeCard
        url={typeof window !== "undefined" ? `${window.location.origin}/${store?.slug || "store"}` : `/${store?.slug || "store"}`}
        storeName={store?.name || "فروشگاه"}
      />
    </div>
  );
}
