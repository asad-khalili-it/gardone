"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LogoUploader from "@/components/ui/LogoUploader";
import { Sparkles, Check, Save } from "lucide-react";

export default function PanelSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    name: "",
    logo: "",
    isActive: true,
    theme: "starter",
    instagram: "",
    phone: "",
    address: "",
    welcomeMessage: "به گردونه شانس خوش آمدید! با چرخاندن گردونه تخفیف ویژه بگیرید.",
    shareMessage: "من از گردونه شانس تخفیف گرفتم! تو هم شانستو امتحان کن 🎉",
  });

  useEffect(() => {
    fetch("/api/panel/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) setSettings((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/panel/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white">تنظیمات فروشگاه و گردونه</h1>
        <p className="text-slate-400 text-sm mt-1">
          شخصی‌سازی ظاهر گردونه، پیام‌ها، و وضعیت فعال/غیرفعال بودن
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
          <div>
            <h3 className="font-bold text-white text-base">وضعیت نمایش گردونه برای مشتریان</h3>
            <p className="text-xs text-slate-400 mt-1">
              در صورت غیرفعال بودن، مشتری با اسکن QR کد پیغام تعطیلی یا غیرفعال بودن را مشاهده می‌کند.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.isActive}
              onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Theme Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            قالب طراحی گردونه (استایل بصری)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "starter", name: "استارتر مدرن", desc: "پس‌زمینه تیره با گرادیان شاد" },
              { id: "luxury", name: "قالب لوکس", desc: "ترکیب طلایی و مشکی سلطنتی" },
              { id: "neon", name: "قالب نئون", desc: "افکت‌های نوری و سایه‌های درخشان" },
            ].map((th) => (
              <div
                key={th.id}
                onClick={() => setSettings({ ...settings, theme: th.id })}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  settings.theme === th.id
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-sm text-white mb-1">{th.name}</div>
                <div className="text-xs text-slate-400">{th.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Info */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <LogoUploader
            currentLogo={settings.logo}
            onUploadSuccess={(url) => setSettings({ ...settings, logo: url })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="نام نمایشی فروشگاه"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              required
            />

            <Input
              label="آیدی اینستاگرام"
              value={settings.instagram}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              placeholder="@store_name"
              dir="ltr"
            />

            <Input
              label="شماره تماس فروشگاه"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="02188888888"
              dir="ltr"
            />

            <Input
              label="آدرس فروشگاه"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="تهران..."
            />
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              متن خوش‌آمدگویی در صفحه اول گردونه
            </label>
            <textarea
              rows={2}
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              متن پیش‌فرض اشتراک‌گذاری در واتساپ و تلگرام
            </label>
            <textarea
              rows={2}
              value={settings.shareMessage}
              onChange={(e) => setSettings({ ...settings, shareMessage: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          {saved && (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              تغییرات با موفقیت ذخیره شد
            </span>
          )}
          {!saved && <span />}

          <Button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/20 text-sm"
            disabled={saving}
          >
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </form>
    </div>
  );
}
