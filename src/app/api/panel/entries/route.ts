import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    let targetStoreId = session.user.storeId;
    if (!targetStoreId && session.user.role === "super_admin") {
      const firstStore = await prisma.store.findFirst();
      if (firstStore) targetStoreId = firstStore.id;
    }

    if (!targetStoreId) {
      return NextResponse.json({ error: "فروشگاهی یافت نشد" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where = {
      storeId: targetStoreId,
      ...(search && {
        OR: [
          { customerName: { contains: search } },
          { customerPhone: { contains: search } },
          { discountCode: { contains: search } },
        ],
      }),
      ...(dateFrom && {
        createdAt: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo + "T23:59:59.999Z") }),
        },
      }),
    };

    const entries = await prisma.entry.findMany({
      where,
      include: {
        prize: { select: { label: true, color: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    return NextResponse.json({ error: "خطا در دریافت لیست مشتریان" }, { status: 500 });
  }
}
