import Link from "next/link";
import { Plus, ExternalLink, Edit3 } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  let stores: any[] = [];
  try {
    stores = await prisma.store.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { entries: true, prizes: true }
        }
      }
    });
  } catch (err) {
    console.error("Database query error:", err);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">مدیریت فروشگاه‌ها</h1>
          <p className="text-slate-400 text-sm mt-1">مشاهده، ایجاد و مدیریت وضعیت فروشگاه‌های عضو</p>
        </div>

        <Link
          href="/admin/stores/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold shadow-lg shadow-orange-500/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن فروشگاه جدید</span>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        {stores.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            هنوز فروشگاهی ثبت نشده است. با زدن دکمه بالا اولین فروشگاه را اضافه کنید.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="text-xs text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-4 font-medium">نام فروشگاه</th>
                  <th className="pb-4 font-medium">شناسه (اسلاگ)</th>
                  <th className="pb-4 font-medium">مالک و تماس</th>
                  <th className="pb-4 font-medium">تعداد جوایز</th>
                  <th className="pb-4 font-medium">کل چرخش‌ها</th>
                  <th className="pb-4 font-medium">وضعیت</th>
                  <th className="pb-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 font-bold text-white">{store.name}</td>
                    <td className="py-4 text-amber-400 dir-ltr font-mono text-xs">/{store.slug}</td>
                    <td className="py-4 text-slate-300">
                      <div>{store.ownerName}</div>
                      <div className="text-xs text-slate-500 dir-ltr font-mono">{store.ownerPhone}</div>
                    </td>
                    <td className="py-4 text-slate-300 font-medium">{store._count?.prizes || 0}</td>
                    <td className="py-4 text-slate-300 font-medium">{store._count?.entries || 0}</td>
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
                    <td className="py-4 flex items-center gap-2">
                      <Link
                        href={`/admin/stores/${store.id}`}
                        className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>ویرایش</span>
                      </Link>
                      <Link
                        href={`/${store.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all font-medium"
                      >
                        <span>گردونه</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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
