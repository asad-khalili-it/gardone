"use client";

import { useEffect, useState } from "react";
import { Search, Download, Calendar, Trophy, Phone, User, CheckCircle2, RotateCcw } from "lucide-react";

interface CustomerEntry {
  id: number;
  customerName: string;
  customerPhone: string;
  discountCode: string;
  isRedeemed: boolean;
  createdAt: string;
  prize: {
    label: string;
    color: string;
  };
}

export default function PanelCustomersPage() {
  const [entries, setEntries] = useState<CustomerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/panel/entries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredEntries = entries.filter((e) =>
    e.customerName.includes(searchTerm) || e.customerPhone.includes(searchTerm) || e.discountCode.includes(searchTerm)
  );

  const toggleRedeem = async (entry: CustomerEntry) => {
    const nextState = !entry.isRedeemed;
    try {
      const res = await fetch(`/api/panel/entries/${entry.id}/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRedeemed: nextState }),
      });
      if (res.ok) {
        setEntries((prev) =>
          prev.map((item) => (item.id === entry.id ? { ...item, isRedeemed: nextState } : item))
        );
      }
    } catch (err) {
      console.error("Error toggling redeem:", err);
    }
  };

  const exportCSV = () => {
    const headers = "نام مشتری,شماره تماس,جایزه,کد تخفیف,تاریخ\n";
    const rows = entries
      .map(
        (e) =>
          `"${e.customerName}","${e.customerPhone}","${e.prize?.label || ""}","${e.discountCode}","${new Date(
            e.createdAt
          ).toLocaleDateString("fa-IR")}"`
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customers-wheel-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">لیست مشتریان و برندگان</h1>
          <p className="text-slate-400 text-sm mt-1">
            مشاهده شماره تماس و اسامی مشتریانی که گردونه شانس را چرخانده‌اند
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold transition-all text-sm cursor-pointer shadow-lg"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>خروجی اکسل (CSV)</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="جستجو با نام، شماره تماس یا کد تخفیف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500"
          />
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            هیچ رکوردی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="text-xs text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-4 font-medium">نام مشتری</th>
                  <th className="pb-4 font-medium">شماره موبایل</th>
                  <th className="pb-4 font-medium">جایزه برنده شده</th>
                  <th className="pb-4 font-medium">کد اختصاصی</th>
                  <th className="pb-4 font-medium">وضعیت استفاده</th>
                  <th className="pb-4 font-medium">تاریخ ثبت</th>
                  <th className="pb-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold">
                        {item.customerName[0]}
                      </div>
                      <span>{item.customerName}</span>
                    </td>
                    <td className="py-4 text-slate-300 font-mono text-xs dir-ltr">
                      {item.customerPhone}
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {item.prize?.label || "جایزه"}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-xs text-amber-400 font-bold dir-ltr">
                      {item.discountCode}
                    </td>
                    <td className="py-4">
                      {item.isRedeemed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>استفاده شد</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <span>استفاده نشده</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-slate-400 text-xs">
                      {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => toggleRedeem(item)}
                        type="button"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          item.isRedeemed
                            ? "bg-slate-800 text-slate-400 hover:text-white"
                            : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20"
                        }`}
                      >
                        {item.isRedeemed ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>لغو مصرف</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ثبت مصرف تخفیف</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
