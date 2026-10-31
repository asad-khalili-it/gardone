import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const stores = await prisma.store.findMany({
      include: {
        _count: { select: { entries: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const storesWithoutPassword = stores.map(({ ownerPassword: _, ...store }) => store);

    return NextResponse.json(storesWithoutPassword);
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json({ error: "خطا در دریافت فروشگاه‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "super_admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      logo,
      phone,
      instagram,
      address,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerPassword,
      theme,
      colors,
      expiresAt,
      prizes: defaultPrizes,
    } = body;

    // Validate required fields
    if (!name || !slug || !ownerName || !ownerEmail || !ownerPassword || !ownerPhone) {
      return NextResponse.json(
        { error: "فیلدهای الزامی را پر کنید" },
        { status: 400 }
      );
    }

    // Check unique slug and email
    const existingStore = await prisma.store.findFirst({
      where: { OR: [{ slug }, { ownerEmail }] },
    });

    if (existingStore) {
      return NextResponse.json(
        { error: "اسلاگ یا ایمیل مالک تکراری است" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);

    // Create store with settings and default prizes
    const store = await prisma.store.create({
      data: {
        name,
        slug,
        logo: logo || null,
        phone: phone || null,
        instagram: instagram || null,
        address: address || null,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerPassword: hashedPassword,
        theme: theme || "starter",
        colors: colors || { primary: "#FF6B35", secondary: "#004E89", accent: "#FFD700", background: "#1a1a2e" },
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        settings: {
          create: {
            maxSpinsPerUser: 1,
            cooldownHours: 24,
            soundEnabled: true,
            spinDurationMs: 5000,
            welcomeMessage: `به گردونه شانس ${name} خوش آمدید!`,
            shareMessage: `من از گردونه شانس ${name} جایزه بردم! 🎉`,
          },
        },
        prizes: {
          create: defaultPrizes && defaultPrizes.length > 0
            ? defaultPrizes
            : [
                { label: "۲۰٪ تخفیف", color: "#FF6B35", probability: 20, sortOrder: 0 },
                { label: "۱۰٪ تخفیف", color: "#004E89", probability: 25, sortOrder: 1 },
                { label: "ارسال رایگان", color: "#2ECC71", probability: 15, sortOrder: 2 },
                { label: "۵٪ تخفیف", color: "#9B59B6", probability: 25, sortOrder: 3 },
                { label: "هدیه ویژه", color: "#E74C3C", probability: 5, sortOrder: 4 },
                { label: "۱۵٪ تخفیف", color: "#F39C12", probability: 5, sortOrder: 5 },
                { label: "بار دیگر تلاش کنید", color: "#95A5A6", probability: 5, sortOrder: 6 },
              ],
        },
      },
      include: {
        prizes: true,
        settings: true,
      },
    });

    const { ownerPassword: _, ...storeWithoutPassword } = store;
    return NextResponse.json(storeWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json({ error: "خطا در ایجاد فروشگاه" }, { status: 500 });
  }
}
