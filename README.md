# 🎡 Gardone | گردونه شانس فروشگاهی

> **An interactive, multi-store, and gamified customer engagement platform built with Next.js, Canvas API, Tailwind CSS, and MySQL.**  
> **سامانه نرم‌افزاری چندفروشگاهی گردونه شانس برای جذب مشتریان حضوری و آنلاین با اسکن QR کد اختصاصی.**

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0+-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Compatible-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

---

## 📑 فهرست / Table of Contents
- [فارسی (Persian Guide)](#-راهنمای-فارسی)
  - [ایده و نحوه کار](#-ایده-و-نحوه-کار)
  - [ویژگی‌های کلیدی](#-ویژگیهای-کلیدی)
  - [معماری و نقشها](#-معماری-و-نقشها)
  - [راهاندازی و نصب محلی](#-راهاندازی-و-نصب-محلی)
- [English Documentation](#-english-documentation)
  - [Overview](#-overview)
  - [Key Features](#-key-features)
  - [Roles & Architecture](#-roles--architecture)
  - [Getting Started](#-getting-started)
  - [Environment Variables](#-environment-variables)
- [License](#-license)

---

# 🇮🇷 راهنمای فارسی

## 🎯 ایده و نحوه کار
فروشگاه‌های حضوری (کافه‌ها، پوشاک، طلافروشی، مزون‌ها و...) پوستر حاوی **QR کد اختصاصی** خود را پشت شیشه مغازه یا روی پیشخوان نصب می‌کنند. 
رهگذران و خریداران با دوربین موبایل بارکد را اسکن کرده، نام و شماره موبایل خود را وارد می‌کنند و گردونه شانس را می‌چرخانند. جوایز (تخفیف‌های درصدی، ارسال رایگان یا هدایای ویژه) همراه با **کد تخفیف یکتا** به مشتری داده می‌شود و شماره تماس آنها برای کمپین‌های تبلیغاتی در دیتابیس فروشگاه ذخیره می‌گردد.

## ✨ ویژگی‌های کلیدی
- **گردونه روان و بومی با Canvas API:** بدون نیاز به پکیج‌های سنگین؛ انیمیشن چرخش پرسرعت کازینویی با حداقل ۵ الی ۷ دور چرخش، لامپ‌های نئونی متحرک و صدای کلیک.
- **تولید خودکار پوستر و QR Code:** تولید خودکار بارکد اختصاصی هر فروشگاه در پنل مغازه‌دار با دکمه **دانلود باکیفیت PNG** و **چاپ مستقیم پوستر آماده برای چسباندن به شیشه مغازه**.
- **۳ قالب بصری متنوع و قابل شخصی‌سازی:**
  - 🎨 **Starter:** طراحی مدرن و شاد تیره.
  - 👑 **Luxury:** طراحی مشکی و طلایی سلطنتی مناسب طلافروشی، ساعت و مزون‌ها.
  - ⚡ **Neon:** افکت‌های سایه نوری و سایبرپانکی مناسب کافه‌ها و فروشگاه‌های مدرن.
- **آپلود مستقیم لوگوی فروشگاه:** آپلودر اختصاصی تصاویر جهت قرارگیری نشان مغازه در بالای گردونه.
- **سیستم ضد تقلب و تفکیک فروشگاه‌ها:** شانس هر مشتری بر اساس هر فروشگاه مجزا است؛ پس از برنده شدن، کد تخفیف ذخیره شده و از چرخش مکرر جلوگیری می‌شود.
- **ثبت مصرف تخفیف (Redeem System):** مغازه‌دار می‌تواند هنگام خرید حضوری، دکمه «ثبت مصرف» را بزند تا یک کد تخفیف دوباره استفاده نشود.
- **خروجی اکسل (CSV):** امکان دانلود لیست شماره موبایل و نام مشتریان برای ارسال اس‌ام‌اس تبلیغاتی.

## 👥 نقش‌ها و دسترسی‌ها

```
                           ┌────────────────────────┐
                           │   Super Admin (مدیر کل)│
                           └───────────┬────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────┐                             ┌───────────────────────┐
│     پنل سوپر ادمین     │                             │  ثبت فروشگاه‌های جدید  │
│  آمار کل و مانیتورینگ  │                             │   تخصیص تم و مدیریت   │
└───────────────────────┘                             └───────────┬───────────┘
                                                                  │
                                                                  ▼
                                                      ┌───────────────────────┐
                                                      │  صاحب فروشگاه (Store)  │
                                                      └───────────┬───────────┘
                                                                  │
            ┌─────────────────────────────────────────────────────┴──────────────────────────┐
            ▼                                                     ▼                          ▼
┌───────────────────────┐                             ┌───────────────────────┐  ┌───────────────────────┐
│  مدیریت جوایز و درصدها│                             │ دریافت QR و چاپ پوستر │  │ مشاهده مشتریان و ابطال│
└───────────────────────┘                             └───────────────────────┘  └───────────────────────┘
```

> **نکته:** در حال حاضر ثبت فروشگاه از طریق پنل ادمین کل مدیریت می‌شود تا بتوانید این سیستم را به صورت پکیج‌های اشتراکی یا طراحی اختصاصی به مغازه‌داران بفروشید. (در صورت تمایل می‌توان فرم ثبت‌نام عمومی هم اضافه کرد).

## 🚀 راه‌اندازی و نصب محلی

### پیش‌نیازها:
- Node.js نسخه 18 یا بالاتر
- سرویس پایگاه‌داده MySQL / MariaDB (مثل XAMPP)

### مراحل نصب:
۱. مخزن را کلون کنید:
```bash
git clone https://github.com/asad-khalili-it/gardone.git
cd gardone
```

۲. وابستگی‌ها را نصب نمایید:
```bash
npm install
```

۳. فایل `.env` را بر اساس `.env.example` بسازید:
```env
DATABASE_URL="mysql://root:@localhost:3306/wheel_of_fortune"
NEXTAUTH_SECRET="your-super-secret-key-123456"
NEXTAUTH_URL="http://localhost:3000"
```

۴. دیتابیس را ایجاد کرده و جداول Prisma را اجرا کنید:
```bash
npx prisma db push
```

۵. اجرای پروژه در محیط توسعه:
```bash
npm run dev
```
اکنون پروژه در آدرس `http://localhost:3000` در دسترس است.

---

# 🇬🇧 English Documentation

## 🌐 Overview
**Gardone** is a turnkey Web SaaS platform designed for offline and online retail stores. By placing a custom **QR Code** at storefront windows or checkouts, passersby can scan with their smartphone camera, enter their contact info (Name & Phone Number), and spin an engaging lucky wheel to win exclusive store vouchers and discounts.

## ⚡ Key Features
- **Pure Canvas API Wheel:** High performance with zero third-party wheel bloat. Features 5-7 rapid spins with natural ease-out deceleration, blinking casino LED sockets, and dynamic ticker audio.
- **Automated QR Code & Poster Generator:** Dynamically creates high-resolution QR codes and printable shop posters right from the store owner's dashboard.
- **Multiple Visual Themes:**
  - `Starter`: Clean dark mode with energetic accent colors.
  - `Luxury`: Royal gold-and-black style tailored for jewelry, luxury goods, and boutiques.
  - `Neon`: Cyberpunk neon glows tailored for cafés and modern stores.
- **Real Logo Uploader:** Integrated file upload system with instant preview for store logos.
- **Voucher Redemption:** Store owners can mark won vouchers as "Redeemed" upon in-store checkout to prevent repeated use.
- **Lead Collection & Excel Export:** Collects valuable opt-in phone numbers with CSV export for SMS and WhatsApp marketing campaigns.

## 🔐 System Architecture

| Role | Access Route | Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | `/admin` | Creates stores, manages subscriptions, assigns visual themes, monitors global stats. |
| **Store Owner** | `/panel` | Edits prize slices, win probabilities, gets QR code poster, redeems vouchers, exports leads. |
| **Customer** | `/[slug]` | Scans QR, registers details, spins wheel, receives unique discount code & confetti animation. |

## 🛠️ Getting Started

```bash
# 1. Clone repository
git clone https://github.com/asad-khalili-it/gardone.git
cd gardone

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Sync Prisma with MySQL
npx prisma db push

# 5. Start dev server
npm run dev
```

## ⚙️ Environment Variables
| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | MySQL Connection URL (`mysql://user:pass@host:port/dbname`) |
| `NEXTAUTH_SECRET` | Secret key for JWT session encryption |
| `NEXTAUTH_URL` | Canonical URL of the deployment (e.g. `https://yourdomain.com`) |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
