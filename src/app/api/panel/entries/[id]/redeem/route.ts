import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const entryId = parseInt(id);

    const body = await request.json().catch(() => ({}));
    const isRedeemed = body.isRedeemed !== undefined ? body.isRedeemed : true;

    // Verify entry belongs to the user's store (or admin)
    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json({ error: "رکورد یافت نشد" }, { status: 404 });
    }

    if (
      session.user.role === "store_owner" &&
      session.user.storeId !== entry.storeId
    ) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: { isRedeemed },
    });

    return NextResponse.json({ success: true, isRedeemed: updated.isRedeemed });
  } catch (error) {
    console.error("Error toggling redeem:", error);
    return NextResponse.json({ error: "خطا در ثبت وضعیت استفاده" }, { status: 500 });
  }
}
