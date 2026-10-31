import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "store_owner" || !session.user.storeId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const prizes = await prisma.prize.findMany({
      where: { storeId: session.user.storeId },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(prizes);
  } catch (error) {
    console.error("Error fetching prizes:", error);
    return NextResponse.json({ error: "خطا در دریافت جوایز" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "store_owner" || !session.user.storeId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const { label, color, probability, discountCode, sortOrder } = body;

    if (!label || !color) {
      return NextResponse.json(
        { error: "نام و رنگ جایزه الزامی است" },
        { status: 400 }
      );
    }

    const prize = await prisma.prize.create({
      data: {
        storeId: session.user.storeId,
        label,
        color,
        probability: probability ?? 10,
        discountCode: discountCode || null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(prize, { status: 201 });
  } catch (error) {
    console.error("Error creating prize:", error);
    return NextResponse.json({ error: "خطا در ایجاد جایزه" }, { status: 500 });
  }
}
