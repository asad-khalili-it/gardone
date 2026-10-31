"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StoreConfig, Prize, CustomerForm } from "@/lib/types";
import WheelCanvas from "@/components/wheel/WheelCanvas";
import PrizeModal from "@/components/wheel/PrizeModal";
import confetti from "canvas-confetti";
import { Sparkles, Phone, User, Store as StoreIcon, ShieldCheck } from "lucide-react";

// Theme CSS
import "@/styles/themes/starter.css";
import "@/styles/themes/luxury.css";
import "@/styles/themes/neon.css";

const MOCK_STORE: StoreConfig = {
  id: 1,
  slug: "demo-store",
  name: "فروشگاه نمونه",
  logo: null,
  phone: "09121234567",
  instagram: "@demo_store",
  address: "تهران، خیابان ولیعصر",
  isActive: true,
  theme: "starter",
  colors: {
    primary: "#FF6B35",
    secondary: "#004E89",
    accent: "#FFD700",
    background: "#0f172a",
  },
};

const MOCK_PRIZES: Prize[] = [
  { id: 1, label: "۱۰٪ تخفیف", color: "#FF6B35", probability: 25, discountCode: "OFF10", isActive: true },
  { id: 2, label: "۲۰٪ تخفیف", color: "#004E89", probability: 20, discountCode: "OFF20", isActive: true },
  { id: 3, label: "۵۰٪ تخفیف طلایی", color: "#FFD700", probability: 5, discountCode: "GOLD50", isActive: true },
  { id: 4, label: "ارسال رایگان", color: "#00C49A", probability: 20, discountCode: "FREESHIP", isActive: true },
  { id: 5, label: "هدیه ویژه خرید", color: "#9B59B6", probability: 10, discountCode: "GIFT", isActive: true },
  { id: 6, label: "۵٪ تخفیف نقدی", color: "#2ECC71", probability: 20, discountCode: "OFF5", isActive: true },
];

function generateDiscountCode(prefix = "WHEEL"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${code}`;
}

export default function WheelPage({ params }: { params: Promise<{ slug: string }> }) {
  const [store, setStore] = useState<StoreConfig>(MOCK_STORE);
  const [prizes, setPrizes] = useState<Prize[]>(MOCK_PRIZES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Registration modal before spin
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [customer, setCustomer] = useState<CustomerForm | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [formError, setFormError] = useState("");

  // Fetch store data dynamically from DB
  useEffect(() => {
    params.then(async ({ slug }) => {
      try {
        const res = await fetch(`/api/stores/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setStore({
            id: data.id,
            slug: data.slug,
            name: data.name,
            logo: data.logo,
            phone: data.phone || "",
            instagram: data.instagram || "",
            address: data.address || "",
            isActive: true,
            theme: data.theme || "starter",
            colors: typeof data.colors === "string" ? JSON.parse(data.colors) : (data.colors || MOCK_STORE.colors),
          });
          if (data.prizes && data.prizes.length > 0) {
            setPrizes(data.prizes.map((p: any) => ({
              id: p.id,
              label: p.label,
              color: p.color,
              probability: p.probability,
              discountCode: p.discountCode || null,
              isActive: true,
            })));
          }
        } else if (slug !== "demo-store") {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error loading store:", err);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  useEffect(() => {
    if (!store.slug) return;
    // Check if customer already spun in this SPECIFIC store
    const savedCustomer = localStorage.getItem(`wheel_customer_${store.slug}`);
    if (savedCustomer) {
      try {
        setCustomer(JSON.parse(savedCustomer));
      } catch (e) {}
    } else {
      setCustomer(null);
    }

    const savedSpin = localStorage.getItem(`wheel_spun_${store.slug}`);
    if (savedSpin) {
      try {
        const parsed = JSON.parse(savedSpin);
        setHasSpun(true);
        setWonPrize(parsed.prize);
        setDiscountCode(parsed.discountCode);
      } catch (e) {}
    } else {
      setHasSpun(false);
      setWonPrize(null);
      setDiscountCode("");
    }
  }, [store.slug]);

  const playWinSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.35);
      });
    } catch (e) {}
  };

  const handleStartSpin = () => {
    if (isSpinning) return;
    if (hasSpun) {
      setShowPrizeModal(true);
      return;
    }

    if (!customer) {
      setShowRegisterModal(true);
      return;
    }

    // Trigger spin on canvas
    const spinFn = (window as any).__wheelSpin;
    if (spinFn) {
      spinFn();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const phoneClean = customerPhone.trim();
    if (!customerName.trim()) {
      setFormError("لطفا نام خود را وارد کنید");
      return;
    }
    if (!/^09\d{9}$/.test(phoneClean)) {
      setFormError("شماره موبایل نامعتبر است (مثال: 09121234567)");
      return;
    }

    const newCustomer = { name: customerName.trim(), phone: phoneClean };
    setCustomer(newCustomer);
    localStorage.setItem(`wheel_customer_${store.slug}`, JSON.stringify(newCustomer));
    setShowRegisterModal(false);

    // Auto spin after registration
    setTimeout(() => {
      const spinFn = (window as any).__wheelSpin;
      if (spinFn) spinFn();
    }, 400);
  };

  const handleSpinEnd = useCallback(async (prize: Prize) => {
    setWonPrize(prize);
    let code = prize.discountCode || generateDiscountCode(store.slug?.toUpperCase() || "LUCKY");
    setDiscountCode(code);
    setHasSpun(true);

    // Persist spin entry to backend database
    if (store.id && customer) {
      try {
        const res = await fetch("/api/spin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId: store.id,
            prizeId: prize.id,
            customerName: customer.name,
            customerPhone: customer.phone,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.discountCode) {
            code = data.discountCode;
            setDiscountCode(code);
          }
        }
      } catch (err) {
        console.error("Error saving spin to backend:", err);
      }
    }

    // Save spin status to prevent re-spinning
    localStorage.setItem(
      `wheel_spun_${store.slug}`,
      JSON.stringify({
        prize,
        discountCode: code,
        date: new Date().toISOString(),
      })
    );

    playWinSound();

    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setShowPrizeModal(true);
    }, 600);
  }, [store, customer]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center" dir="rtl">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center text-3xl mx-auto">
            🚫
          </div>
          <h1 className="text-2xl font-black">فروشگاه یافت نشد یا غیرفعال است</h1>
          <p className="text-slate-400 text-sm">
            ممکن است آدرس اسکن شده اشتباه باشد یا دسترسی این گردونه توسط صاحب فروشگاه موقتاً غیرفعال شده باشد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`theme-${store.theme} min-h-screen bg-[#090d16] text-white flex flex-col justify-between relative overflow-hidden select-none`} dir="rtl">
      {/* Background radial ambient lights & stage spotlight */}
      <div className="wheel-page-bg fixed inset-0 z-0 pointer-events-none" />

      {/* Floating Animated Light Orbs */}
      <div className="ambient-glow absolute top-12 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 bg-purple-600/15 rounded-full blur-[90px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Sparkle particles overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Top Bar: Store Header */}
      <header className="relative z-10 pt-5 sm:pt-7 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="inline-flex items-center gap-3.5 sm:gap-4.5 px-5 sm:px-7 py-3 sm:py-3.5 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-[0_10px_35px_-5px_rgba(245,158,11,0.25)] backdrop-blur-xl"
        >
          {/* Store Logo with Golden Glow */}
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-[2px] shadow-lg shadow-orange-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl sm:text-3xl">💎</span>
                )}
              </div>
            </div>
            <span className="absolute -bottom-1 -left-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                {store.name}
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                رسمی
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>گردونه شانس • تخفیف‌ها و هدایای ویژه مشتریان</span>
            </p>
          </div>
        </motion.div>
      </header>

      {/* Center: The Wheel */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative flex flex-col items-center"
        >
          {/* Wheel canvas */}
          <WheelCanvas
            prizes={prizes}
            onSpinEnd={handleSpinEnd}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            spinDuration={5000}
          />

          {/* Spin CTA Button with Glow Effect */}
          <div className="relative mt-8 group">
            {!hasSpun && (
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse" />
            )}
            <motion.button
              whileHover={{ scale: isSpinning ? 1 : 1.05 }}
              whileTap={{ scale: isSpinning ? 1 : 0.95 }}
              onClick={handleStartSpin}
              disabled={isSpinning}
              className={`relative px-10 sm:px-14 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl transition-all flex items-center gap-3 cursor-pointer shadow-2xl ${
                isSpinning
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : hasSpun
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 border border-emerald-400/40"
                  : "bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-slate-950 font-black shadow-[0_10px_30px_rgba(245,158,11,0.5)] border border-yellow-200/40"
              }`}
            >
              {hasSpun ? (
                <>
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <span>مشاهده جایزه من 🎁</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-slate-950 animate-bounce" />
                  <span>{isSpinning ? "در حال چرخش گردونه..." : "بچرخون و جایزه ببر! 🎯"}</span>
                </>
              )}
            </motion.button>
          </div>

          {hasSpun && (
            <p className="mt-3 text-xs text-amber-300/80 font-medium">
              ⚠️ شما شانس امروز خود را استفاده کرده‌اید! کد تخفیف شما ذخیره شده است.
            </p>
          )}

          {customer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 backdrop-blur-md"
            >
              مشتری گرامی: <span className="text-amber-400 font-bold">{customer.name}</span> عزیز خوش آمدید
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 pb-6 px-4 text-center text-xs text-slate-500">
        <p>با اسکن بارکد در خرید حضوری، کد تخفیف را به صندوق‌دار تحویل دهید</p>
        {store.instagram && <p className="mt-1 text-slate-400 font-mono dir-ltr">{store.instagram}</p>}
      </footer>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                  🎁
                </div>
                <h2 className="text-xl font-black text-white">ثبت مشخصات جهت دریافت جایزه</h2>
                <p className="text-xs text-slate-400 mt-1">
                  کد تخفیف اختصاصی شما با این شماره ثبت خواهد شد
                </p>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
                  {formError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="مثال: سارا محمدی"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="09123456789"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono text-left"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-orange-500/20 cursor-pointer mt-2"
                >
                  ثبت و چرخاندن گردونه! 🎡
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Prize Modal */}
      {wonPrize && (
        <PrizeModal
          isOpen={showPrizeModal}
          onClose={() => setShowPrizeModal(false)}
          prizeName={wonPrize.label}
          discountCode={discountCode}
          storeName={store.name}
          shareUrl={typeof window !== "undefined" ? window.location.href : ""}
        />
      )}
    </div>
  );
}
