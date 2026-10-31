"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("ایمیل یا رمز عبور اشتباه است");
      } else {
        // Fetch session to determine role redirect
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (session?.user?.role === "super_admin") {
          router.push("/admin");
        } else {
          router.push("/panel");
        }
      }
    } catch (err) {
      setError("خطایی در ورود رخ داد. لطفا مجدد تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden text-white" dir="rtl">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20 text-3xl">
            🎡
          </div>
          <h1 className="text-2xl font-black text-white">ورود به پنل مدیریت</h1>
          <p className="text-slate-400 text-sm mt-2">
            ورود صاحبان فروشگاه و مدیریت سامانه گردونه شانس
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="ایمیل کاربری"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@store.com"
            required
          />

          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer text-slate-950 text-base"
            disabled={loading}
          >
            {loading ? "در حال بررسی..." : "ورود به حساب کاربری"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            هنوز برای فروشگاه خود ثبت‌نام نکرده‌اید؟{" "}
            <Link href="/register" className="text-amber-400 hover:text-amber-300 font-bold">
              ثبت‌نام رایگان فروشگاه
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <div className="mb-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300/90 text-right space-y-1">
            <p className="font-bold text-amber-400">اطلاعات ورود پیش‌فرض مدیر کل:</p>
            <p>ایمیل: <span className="font-mono text-white">admin@admin.com</span></p>
            <p>رمز عبور: <span className="font-mono text-white">admin123</span></p>
          </div>
          سامانه گردونه شانس فروشگاهی • نسخه حرفه‌ای
        </div>
      </div>
    </div>
  );
}
