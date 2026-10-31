import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const storeId = parseInt(id);

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        prizes: { orderBy: { sortOrder: "asc" } },
        settings: true,
        _count: { select: { entries: true } },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "فروشگاه یافت نشد" }, { status: 404 });
    }

    const { ownerPassword: _, ...storeWithoutPassword } = store;
    return NextResponse.json(storeWithoutPassword);
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json({ error: "خطا در دریافت فروشگاه" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const storeId = parseInt(id);
    const body = await request.json();

    // Remove sensitive/immutable fields
    const { ownerPassword: _, id: __, ...updateData } = body;

    const store = await prisma.store.update({
      where: { id: storeId },
      data: updateData,
    });

    const { ownerPassword: _p, ...storeWithoutPassword } = store;
    return NextResponse.json(storeWithoutPassword);
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی فروشگاه" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const storeId = parseInt(id);

    await prisma.store.delete({
      where: { id: storeId },
    });

    return NextResponse.json({ message: "فروشگاه با موفقیت حذف شد" });
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json({ error: "خطا در حذف فروشگاه" }, { status: 500 });
  }
}
