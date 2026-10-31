import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    // Determine target store id: if store_owner use their storeId, if super_admin get first store
    let targetStoreId = session.user.storeId;
    if (!targetStoreId && session.user.role === "super_admin") {
      const firstStore = await prisma.store.findFirst();
      if (firstStore) targetStoreId = firstStore.id;
    }

    if (!targetStoreId) {
      return NextResponse.json({ error: "فروشگاهی یافت نشد" }, { status: 404 });
    }

    const store = await prisma.store.findUnique({
      where: { id: targetStoreId },
      include: { settings: true },
    });

    if (!store) {
      return NextResponse.json({ error: "فروشگاه یافت نشد" }, { status: 404 });
    }

    let settings = store.settings;
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { storeId: store.id },
      });
    }

    // Merge store and settings into a clean response
    return NextResponse.json({
      id: store.id,
      slug: store.slug,
      name: store.name,
      isActive: store.isActive,
      theme: store.theme,
      instagram: store.instagram || "",
      phone: store.phone || "",
      address: store.address || "",
      logo: store.logo || "",
      welcomeMessage: settings.welcomeMessage || `به گردونه شانس ${store.name} خوش آمدید!`,
      shareMessage: settings.shareMessage || `من از گردونه شانس ${store.name} جایزه گرفتم! 🎉`,
      maxSpinsPerUser: settings.maxSpinsPerUser,
      cooldownHours: settings.cooldownHours,
      soundEnabled: settings.soundEnabled,
      spinDurationMs: settings.spinDurationMs,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "خطا در دریافت تنظیمات" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const {
      name,
      instagram,
      phone,
      address,
      logo,
      theme,
      isActive,
      welcomeMessage,
      shareMessage,
      maxSpinsPerUser,
      cooldownHours,
      soundEnabled,
      spinDurationMs,
    } = body;

    // 1. Update store info
    await prisma.store.update({
      where: { id: targetStoreId },
      data: {
        ...(name !== undefined && { name }),
        ...(instagram !== undefined && { instagram }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(logo !== undefined && { logo }),
        ...(theme !== undefined && { theme }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    // 2. Update store settings
    const settings = await prisma.storeSettings.upsert({
      where: { storeId: targetStoreId },
      update: {
        ...(welcomeMessage !== undefined && { welcomeMessage }),
        ...(shareMessage !== undefined && { shareMessage }),
        ...(maxSpinsPerUser !== undefined && { maxSpinsPerUser }),
        ...(cooldownHours !== undefined && { cooldownHours }),
        ...(soundEnabled !== undefined && { soundEnabled }),
        ...(spinDurationMs !== undefined && { spinDurationMs }),
      },
      create: {
        storeId: targetStoreId,
        ...(welcomeMessage !== undefined && { welcomeMessage }),
        ...(shareMessage !== undefined && { shareMessage }),
        ...(maxSpinsPerUser !== undefined && { maxSpinsPerUser }),
        ...(cooldownHours !== undefined && { cooldownHours }),
        ...(soundEnabled !== undefined && { soundEnabled }),
        ...(spinDurationMs !== undefined && { spinDurationMs }),
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی تنظیمات" }, { status: 500 });
  }
}
