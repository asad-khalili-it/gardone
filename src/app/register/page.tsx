"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Store, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerPassword: "",
    instagram: "",
    address: "",
    theme: "starter",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Auto generate slug if name changed and slug not manually customized
      ...(name === "name" && !prev.slug
        ? {
            slug: value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
          }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطایی در ثبت‌نام رخ داد");
      }

      // Auto login the newly registered store owner
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: formData.ownerEmail,
        password: formData.ownerPassword,
      });

      if (loginRes?.error) {
        router.push("/login");
      } else {
        router.push("/panel");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden py-8 px-4" dir="rtl">
      {/* Background glow effects */}
      <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between mb-6 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>بازگشت به صفحه اصلی</span>
        </Link>
        <Link href="/login" className="text-amber-400 hover:text-amber-300 text-xs font-bold transition-colors">
          قبلاً ثبت‌نام کرده‌اید؟ ورود به پنل
        </Link>
      </div>

      {/* Main Register Box */}
      <div className="max-w-2xl mx-auto w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-orange-500/20">
            🎡
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            راه‌اندازی رایگان گردونه شانس فروشگاه شما
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            در کمتر از ۲ دقیقه ثبت‌نام کنید و QR کد اختصاصی فروشگاهتان را تحویل بگیرید!
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs sm:text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Store className="w-4 h-4" />
              <span>مشخصات فروشگاه</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="نام فروشگاه (فارسی)"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثال: کافه لوتوس"
                required
              />

              <Input
                label="شناسه انگلیسی گردونه (اسلاگ در لینک)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="lotus-cafe"
                dir="ltr"
                required
              />

              <Input
                label="آیدی اینستاگرام (اختیاری)"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@lotus_cafe"
                dir="ltr"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  قالب ظاهری گردونه
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="starter">قالب مدرن و شاد (Starter)</option>
                  <option value="luxury">قالب لوکس و طلایی (Luxury)</option>
                  <option value="neon">قالب نئون و سایبرپانک (Neon)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="آدرس فیزیکی فروشگاه (اختیاری)"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="تهران، خیابان ولیعصر..."
                />
              </div>
            </div>
          </div>

          {/* Owner Account */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4" />
              <span>اطلاعات ورود به پنل مدیریت</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="نام و نام خانوادگی شما"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="علی رضایی"
                required
              />

              <Input
                label="شماره موبایل (جهت پشتیبانی)"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                placeholder="09121234567"
                dir="ltr"
                required
              />

              <Input
                label="ایمیل (نام کاربری ورود)"
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="owner@store.com"
                dir="ltr"
                required
              />

              <Input
                label="رمز عبور پنل"
                name="ownerPassword"
                type="password"
                value={formData.ownerPassword}
                onChange={handleChange}
                placeholder="حداقل ۶ کاراکتر"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl shadow-xl shadow-orange-500/25 text-base cursor-pointer"
              disabled={loading}
            >
              {loading ? "در حال ایجاد فروشگاه و ساخت QR کد..." : "ایجاد فروشگاه و ورود به پنل 🎯"}
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          با ثبت‌نام، تمامی امکانات شامل پوستر آماده چاپ و پنل مدیریت مشتریان بلافاصله فعال می‌شود.
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 pt-6">
        سامانه هوشمند گردونه شانس • طراحی و توسعه توسط{" "}
        <a
          href="https://asadkhalili.ir"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 font-bold"
        >
          اسد خلیلی (Asad Khalili)
        </a>
      </footer>
    </div>
  );
}
