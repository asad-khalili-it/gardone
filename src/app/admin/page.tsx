import Link from "next/link";
import { Store, Users, Trophy, Plus, ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let storeCount = 0;
  let activeStoreCount = 0;
  let totalSpins = 0;
  let recentStores: any[] = [];

  try {
    storeCount = await prisma.store.count();
    activeStoreCount = await prisma.store.count({ where: { isActive: true } });
    totalSpins = await prisma.entry.count();
    recentStores = await prisma.store.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { entries: true, prizes: true }
        }
      }
    });
  } catch (err) {
    console.error("Database query failed:", err);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">داشبورد مدیریت کل</h1>
          <p className="text-slate-400 text-sm mt-1">مشاهده وضعیت کلی فروشگاه‌ها و مشارکت مشتریان</p>
        </div>

        <Link
          href="/admin/stores/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold shadow-lg shadow-orange-500/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن فروشگاه جدید</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">کل فروشگاه‌ها</p>
              <h3 className="text-3xl font-black text-white mt-2">{storeCount}</h3>
              <p className="text-xs text-emerald-400 mt-2 font-medium">
                {activeStoreCount} فروشگاه فعال
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Store className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">کل چرخش‌ها (مشتریان)</p>
              <h3 className="text-3xl font-black text-white mt-2">{totalSpins}</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">مشارکت ثبت‌شده</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">میانگین چرخش هر فروشگاه</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {storeCount > 0 ? Math.round(totalSpins / storeCount) : 0}
              </h3>
              <p className="text-xs text-amber-400 mt-2 font-medium">بازدهی جذب مشتری</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Stores */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">آخرین فروشگاه‌های ثبت‌شده</h2>
          <Link href="/admin/stores" className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1">
            <span>مشاهده همه</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentStores.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            هنوز فروشگاهی ثبت نشده است. از دکمه بالا اولین فروشگاه را اضافه کنید.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="text-xs text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-medium">نام فروشگاه</th>
                  <th className="pb-3 font-medium">آدرس لینک گردونه</th>
                  <th className="pb-3 font-medium">مالک</th>
                  <th className="pb-3 font-medium">وضعیت</th>
                  <th className="pb-3 font-medium">تعداد چرخش‌ها</th>
                  <th className="pb-3 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentStores.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 font-bold text-white">{store.name}</td>
                    <td className="py-4 text-amber-400 dir-ltr font-mono text-xs">/{store.slug}</td>
                    <td className="py-4 text-slate-300">{store.ownerName}</td>
                    <td className="py-4">
                      {store.isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          فعال
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-slate-300 font-medium">{store._count?.entries || 0}</td>
                    <td className="py-4">
                      <Link
                        href={`/${store.slug}`}
                        target="_blank"
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
                      >
                        مشاهده گردونه ↗
                      </Link>
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
