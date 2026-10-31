"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LogoUploader from "@/components/ui/LogoUploader";
import { ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditStorePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    instagram: "",
    address: "",
    theme: "starter",
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/stores/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setFormData({
            name: data.name || "",
            slug: data.slug || "",
            logo: data.logo || "",
            ownerName: data.ownerName || "",
            ownerEmail: data.ownerEmail || "",
            ownerPhone: data.ownerPhone || "",
            instagram: data.instagram || "",
            address: data.address || "",
            theme: data.theme || "starter",
            isActive: data.isActive ?? true,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("خطا در دریافت اطلاعات فروشگاه");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as any).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطایی در ویرایش رخ داد");
      }

      router.push("/admin/stores");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("آیا از حذف این فروشگاه و کلیه جوایز و آمارهای آن اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/stores");
      }
    } catch (e) {
      alert("خطا در حذف فروشگاه");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">در حال بارگذاری اطلاعات فروشگاه...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/stores" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">ویرایش فروشگاه: {formData.name}</h1>
            <p className="text-slate-400 text-sm mt-0.5">تغییر اطلاعات، قالب، وضعیت و مشخصات مالک</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>حذف فروشگاه</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <div>
              <h3 className="font-bold text-white text-sm">وضعیت فروشگاه (فعال / غیرفعال)</h3>
              <p className="text-xs text-slate-400 mt-0.5">در صورت غیرفعال بودن، گردونه نمایش داده نمی‌شود.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-bold text-amber-400 border-b border-slate-800 pb-2">
              اطلاعات پایه
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
                required
              />

              <Input
                label="شناسه انگلیسی (اسلاگ در لینک)"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                dir="ltr"
                required
              />

              <Input
                label="آیدی اینستاگرام"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
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
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-amber-400 border-b border-slate-800 pb-2">
              اطلاعات مالک فروشگاه
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="نام مالک"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />

              <Input
                label="شماره تماس مالک"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                dir="ltr"
                required
              />

              <Input
                label="ایمیل پنل کاربری"
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleChange}
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Link
              href="/admin/stores"
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              انصراف
            </Link>
            <Button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-sm"
              disabled={saving}
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
