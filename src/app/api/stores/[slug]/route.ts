import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const store = await prisma.store.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        logo: true,
        phone: true,
        instagram: true,
        theme: true,
        colors: true,
        prizes: {
          where: { isActive: true },
          select: {
            id: true,
            label: true,
            color: true,
            probability: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        settings: {
          select: {
            maxSpinsPerUser: true,
            cooldownHours: true,
            soundEnabled: true,
            spinDurationMs: true,
            welcomeMessage: true,
            shareMessage: true,
            sharePlatforms: true,
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        { error: "فروشگاه یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات فروشگاه" },
      { status: 500 }
    );
  }
}
