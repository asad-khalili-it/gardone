import Link from "next/link";
import { ArrowLeft, Sparkles, Smartphone, Store, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden" dir="rtl">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">
              🎡
            </div>
            <div>
              <span className="font-black text-xl bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                گردونه شانس فروشگاهی
              </span>
              <span className="block text-[11px] text-slate-400 font-medium">افزایش فروش با بازی و جایزه</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-sm font-semibold transition-all text-slate-200"
            >
              ورود به پنل مدیریت
            </Link>
            <Link
              href="/demo-store"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
            >
              <span>مشاهده دمو گردونه</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>جدیدترین راهکار جذب مشتری حضوری و آنلاین</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight">
          QR کد را پشت شیشه مغازه بزنید، <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
            رهگذران را به مشتری وفادار تبدیل کنید!
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">
          مشتریان با اسکن بارکد، شماره تماس خود را ثبت کرده و گردونه شانس را می‌چرخانند. جوایز و تخفیف‌ها آنها را ترغیب به خرید فوری از فروشگاه شما می‌کند.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/demo-store"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-base font-black shadow-2xl shadow-orange-500/30 transition-all flex items-center justify-center gap-3"
          >
            <span>تست زنده گردونه (فروشگاه نمونه)</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-white text-base font-bold transition-all"
          >
            پنل سوپر ادمین
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">دریافت شماره موبایل</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              جمع‌آوری بانک اطلاعاتی ارزشمند از شماره تماس مشتریان واقعی قبل از چرخاندن گردونه برای ارسال پیامک‌های تبلیغاتی آینده.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 text-2xl">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">پنل اختصاصی فروشگاه</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              هر مغازه‌دار پنل خودش را دارد و می‌تواند در هر لحظه درصد جوایز را تغییر دهد، گردونه را خاموش/روشن کند و لیست مشتریان را دانلود کند.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-2xl">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">قالب‌های متنوع بصری</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              پشتیبانی از قالب‌های استارتر، لوکس طلایی و نئونی بدون نیاز به کدنویسی مجدد برای فروشگاه‌های طلا، کافه، لباس و غیره.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        سامانه گردونه شانس فروشگاهی • طراحی و توسعه فوق‌حرفه‌ای
      </footer>
    </div>
  );
}
