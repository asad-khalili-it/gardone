"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Prize {
  id: number;
  label: string;
  color: string;
  probability: number;
  discountCode: string | null;
  isActive: boolean;
}

export default function PanelPrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [newPrize, setNewPrize] = useState({
    label: "",
    color: "#FF6B35",
    probability: 15,
    discountCode: "",
  });

  const fetchPrizes = async () => {
    try {
      const res = await fetch("/api/panel/prizes");
      if (res.ok) {
        const data = await res.json();
        setPrizes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const handleAddPrize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/panel/prizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrize),
      });
      if (res.ok) {
        setIsAdding(false);
        setNewPrize({ label: "", color: "#FF6B35", probability: 15, discountCode: "" });
        fetchPrizes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (prize: Prize) => {
    try {
      const res = await fetch(`/api/panel/prizes/${prize.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !prize.isActive }),
      });
      if (res.ok) {
        setPrizes((prev) =>
          prev.map((p) => (p.id === prize.id ? { ...p, isActive: !p.isActive } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این گزینه مطمئن هستید؟")) return;
    try {
      const res = await fetch(`/api/panel/prizes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPrizes((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">مدیریت گزینه‌ها و جوایز گردونه</h1>
          <p className="text-slate-400 text-sm mt-1">
            تعیین متن، درصد شانس و رنگ هر برش از گردونه شانس
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold transition-all text-sm cursor-pointer shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن گزینه جدید</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-4">افزودن برش جدید به گردونه</h2>
          <form onSubmit={handleAddPrize} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="عنوان گزینه روی گردونه"
              value={newPrize.label}
              onChange={(e) => setNewPrize({ ...newPrize, label: e.target.value })}
              placeholder="مثلا: ۲۰٪ تخفیف خرید"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">رنگ پس‌زمینه برش</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newPrize.color}
                  onChange={(e) => setNewPrize({ ...newPrize, color: e.target.value })}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={newPrize.color}
                  onChange={(e) => setNewPrize({ ...newPrize, color: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  dir="ltr"
                />
              </div>
            </div>

            <Input
              label="درصد شانس برنده شدن (از ۱۰۰)"
              type="number"
              min="1"
              max="100"
              value={String(newPrize.probability)}
              onChange={(e) => setNewPrize({ ...newPrize, probability: Number(e.target.value) })}
              required
            />

            <Input
              label="کد تخفیف اختصاصی (اختیاری)"
              value={newPrize.discountCode}
              onChange={(e) => setNewPrize({ ...newPrize, discountCode: e.target.value })}
              placeholder="مثلا: OFF20"
              dir="ltr"
            />

            <div className="md:col-span-4 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
              >
                انصراف
              </button>
              <Button type="submit" className="px-6 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm">
                افزودن به گردونه
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Prizes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes.map((prize) => (
          <div
            key={prize.id}
            className={`p-5 rounded-2xl border transition-all ${
              prize.isActive
                ? "bg-slate-900 border-slate-800"
                : "bg-slate-900/40 border-slate-800/40 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full shrink-0 shadow-md"
                  style={{ backgroundColor: prize.color }}
                />
                <div>
                  <h3 className="font-bold text-white text-base">{prize.label}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    شانس برنده شدن: <strong className="text-amber-400">{prize.probability}٪</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(prize)}
                  title={prize.isActive ? "غیرفعال کردن" : "فعال کردن"}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  {prize.isActive ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(prize.id)}
                  title="حذف گزینه"
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {prize.discountCode && (
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">کد تخفیف:</span>
                <span className="font-mono bg-slate-950 px-2 py-1 rounded text-amber-400 font-bold">
                  {prize.discountCode}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
