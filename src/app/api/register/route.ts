import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateIranianPhone } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerPassword,
      instagram,
      address,
      theme,
    } = body;

    // Validate required fields
    if (!name || !slug || !ownerName || !ownerEmail || !ownerPassword || !ownerPhone) {
      return NextResponse.json(
        { error: "لطفاً تمامی فیلدهای الزامی را تکمیل کنید" },
        { status: 400 }
      );
    }

    if (!validateIranianPhone(ownerPhone)) {
      return NextResponse.json(
        { error: "شماره موبایل وارد شده معتبر نیست (فرمت صحیح: 09xxxxxxxxx)" },
        { status: 400 }
      );
    }

    // Slug validation: english letters, numbers, hyphens
    const cleanSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      return NextResponse.json(
        { error: "شناسه انگلیسی (اسلاگ) فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره (-) باشد." },
        { status: 400 }
      );
    }

    // Check unique slug and email
    const existingStore = await prisma.store.findFirst({
      where: {
        OR: [{ slug: cleanSlug }, { ownerEmail: ownerEmail.trim().toLowerCase() }],
      },
    });

    if (existingStore) {
      if (existingStore.slug === cleanSlug) {
        return NextResponse.json(
          { error: "این شناسه انگلیسی (لینک) قبلاً توسط فروشگاه دیگری ثبت شده است. لطفاً شناسه دیگری انتخاب کنید." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "یک حساب کاربری با این ایمیل قبلاً ثبت نام کرده است." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);

    // Create store with default settings and 7 attractive prizes
    const store = await prisma.store.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        ownerEmail: ownerEmail.trim().toLowerCase(),
        ownerPassword: hashedPassword,
        instagram: instagram?.trim() || null,
        address: address?.trim() || null,
        theme: theme || "starter",
        isActive: true,
        settings: {
          create: {
            maxSpinsPerUser: 1,
            cooldownHours: 24,
            soundEnabled: true,
            spinDurationMs: 5000,
            welcomeMessage: `به گردونه شانس ${name} خوش آمدید! با چرخاندن گردونه تخفیف ویژه بگیرید.`,
            shareMessage: `من از گردونه شانس ${name} جایزه گرفتم! 🎉 تو هم شانستو امتحان کن!`,
          },
        },
        prizes: {
          create: [
            { label: "۱۰٪ تخفیف", color: "#FF6B35", probability: 25, sortOrder: 0 },
            { label: "۲۰٪ تخفیف", color: "#004E89", probability: 20, sortOrder: 1 },
            { label: "۵۰٪ تخفیف طلایی", color: "#FFD700", probability: 5, sortOrder: 2 },
            { label: "ارسال رایگان", color: "#2ECC71", probability: 20, sortOrder: 3 },
            { label: "هدیه ویژه خرید", color: "#9B59B6", probability: 10, sortOrder: 4 },
            { label: "۵٪ تخفیف نقدی", color: "#E74C3C", probability: 15, sortOrder: 5 },
            { label: "دوباره تلاش کنید", color: "#95A5A6", probability: 5, sortOrder: 6 },
          ],
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "فروشگاه با موفقیت ایجاد شد",
        slug: store.slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public store registration error:", error);
    return NextResponse.json(
      { error: "خطایی در ثبت‌نام رخ داد. لطفاً مجدداً تلاش کنید." },
      { status: 500 }
    );
  }
}
