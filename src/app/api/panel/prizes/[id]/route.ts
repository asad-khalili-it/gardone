import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "store_owner" || !session.user.storeId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const prizeId = parseInt(id);

    // Verify prize belongs to owner's store
    const existingPrize = await prisma.prize.findFirst({
      where: { id: prizeId, storeId: session.user.storeId },
    });

    if (!existingPrize) {
      return NextResponse.json({ error: "جایزه یافت نشد" }, { status: 404 });
    }

    const body = await request.json();
    const { label, color, probability, discountCode, isActive, sortOrder } = body;

    const prize = await prisma.prize.update({
      where: { id: prizeId },
      data: {
        ...(label !== undefined && { label }),
        ...(color !== undefined && { color }),
        ...(probability !== undefined && { probability }),
        ...(discountCode !== undefined && { discountCode }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(prize);
  } catch (error) {
    console.error("Error updating prize:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی جایزه" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "store_owner" || !session.user.storeId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const prizeId = parseInt(id);

    // Verify prize belongs to owner's store
    const existingPrize = await prisma.prize.findFirst({
      where: { id: prizeId, storeId: session.user.storeId },
    });

    if (!existingPrize) {
      return NextResponse.json({ error: "جایزه یافت نشد" }, { status: 404 });
    }

    await prisma.prize.delete({
      where: { id: prizeId },
    });

    return NextResponse.json({ message: "جایزه با موفقیت حذف شد" });
  } catch (error) {
    console.error("Error deleting prize:", error);
    return NextResponse.json({ error: "خطا در حذف جایزه" }, { status: 500 });
  }
}
