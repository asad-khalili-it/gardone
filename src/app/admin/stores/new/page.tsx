"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LogoUploader from "@/components/ui/LogoUploader";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
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
      // Auto-generate slug if name changes and slug wasn't manually customized
      ...(name === "name" && !prev.slug ? { slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطایی در ثبت فروشگاه رخ داد");
      }

      router.push("/admin/stores");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/stores" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">افزودن فروشگاه جدید</h1>
          <p className="text-slate-400 text-sm mt-0.5">مشخصات فروشگاه و اطلاعات ورود صاحب فروشگاه را وارد کنید</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-amber-400 border-b border-slate-800 pb-2">
              اطلاعات فروشگاه
            </h2>

            <LogoUploader
              currentLogo={formData.logo}
              onUploadSuccess={(url) => setFormData((p) => ({ ...p, logo: url }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="نام فروشگاه"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثال: بوتیک شیک‌پوشان"
                required
              />

              <Input
                label="شناسه انگلیسی (اسلاگ در لینک)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="مثال: boutique-shik"
                dir="ltr"
                required
              />

              <Input
                label="آیدی اینستاگرام"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@boutique_shik"
                dir="ltr"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">قالب ظاهری گردونه</label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="starter">قالب پایه (Starter - مدرن تیره)</option>
                  <option value="luxury">قالب لوکس (Luxury - طلایی شیک)</option>
                  <option value="neon">قالب نئون (Neon - نورانی و جذاب)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Input
                  label="آدرس فیزیکی فروشگاه"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="تهران، خیابان ولیعصر..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-amber-400 border-b border-slate-800 pb-2">
              اطلاعات دسترسی صاحب فروشگاه
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="نام و نام خانوادگی مدیر فروشگاه"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="علی رضایی"
                required
              />

              <Input
                label="شماره تماس مدیر"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                placeholder="09121234567"
                dir="ltr"
                required
              />

              <Input
                label="ایمیل ورود به پنل"
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

          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              href="/admin/stores"
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              انصراف
            </Link>
            <Button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/20 text-sm"
              disabled={loading}
            >
              {loading ? "در حال ایجاد..." : "ثبت فروشگاه و ایجاد گردونه"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
