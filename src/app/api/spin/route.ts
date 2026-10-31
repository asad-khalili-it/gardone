import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateDiscountCode, validateIranianPhone } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, customerName, customerPhone, prizeId } = body;

    // Validate input
    if (!storeId || !customerName || !customerPhone || !prizeId) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    if (!validateIranianPhone(customerPhone)) {
      return NextResponse.json(
        { error: "شماره تلفن نامعتبر است. فرمت صحیح: 09xxxxxxxxx" },
        { status: 400 }
      );
    }

    // Check store exists and is active
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { settings: true, prizes: true },
    });

    if (!store || !store.isActive) {
      return NextResponse.json(
        { error: "فروشگاه یافت نشد یا غیرفعال است" },
        { status: 404 }
      );
    }

    // Verify prize exists and belongs to this store (or pick first active prize if mock)
    let prize = await prisma.prize.findFirst({
      where: { id: prizeId, storeId, isActive: true },
    });

    if (!prize) {
      // Fallback: if prizeId was from client-side mock or order, match by store's first active prize
      prize = store.prizes.find((p) => p.isActive) || null;
    }

    if (!prize) {
      return NextResponse.json(
        { error: "جایزه نامعتبر است" },
        { status: 400 }
      );
    }

    // Generate a unique discount code
    let discountCode = generateDiscountCode(store.slug);
    // Ensure uniqueness
    let exists = await prisma.entry.findUnique({ where: { discountCode } });
    while (exists) {
      discountCode = generateDiscountCode(store.slug);
      exists = await prisma.entry.findUnique({ where: { discountCode } });
    }

    // Get IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;

    // Create entry
    const entry = await prisma.entry.create({
      data: {
        storeId,
        prizeId,
        customerName,
        customerPhone,
        ipAddress,
        discountCode,
      },
      include: {
        prize: {
          select: {
            label: true,
            color: true,
            discountCode: true,
          },
        },
      },
    });

    return NextResponse.json({
      discountCode: entry.discountCode,
      prize: entry.prize,
    });
  } catch (error) {
    console.error("Error processing spin:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}
