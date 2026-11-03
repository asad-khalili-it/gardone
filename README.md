# 🎡 Gardone | گردونه شانس فروشگاهی

> **یک پلتفرم هوشمند، چندفروشگاهی و گیمیفای‌شده (Gamified) برای افزایش فروش و جذب مشتریان حضوری با اسکن QR کد اختصاصی.**  
> **An interactive, multi-store, gamified customer acquisition platform built with Next.js 16, Canvas API, Tailwind CSS, and MySQL.**

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0+-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Compatible-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

---

## 📑 فهرست مطالب / Table of Contents
- [🇮🇷 راهنمای فارسی](#-راهنمای-فارسی)
  - [ایده و نحوه عملکرد](#-ایده-و-نحوه-عملکرد)
  - [ویژگی‌های کلیدی](#-ویژگیهای-کلیدی)
  - [نقش‌ها، صفحات و مسیرهای سامانه](#-نقشها-صفحات-و-مسیرهای-سامانه)
  - [راهنمای جامع نصب و راه‌اندازی (لوکال و هاست/سرور)](#-راهنمای-جامع-نصب-و-راهاندازی)
  - [مدیریت و ریست رمز عبور ادمین](#-مدیریت-و-ریست-رمز-عبور-ادمین)
  - [تنظیمات پروداکشن (PM2 و وب سرور / cPanel)](#-تنظیمات-پروداکشن-pm2-و-وب-سرور--cpanel)
- [🇬🇧 English Documentation](#-english-documentation)
  - [Overview](#-overview)
  - [Key Features](#-key-features)
  - [Roles & Architecture](#-roles--architecture)
  - [Quick Start & Installation](#-quick-start--installation)
  - [Admin Setup & Password Reset](#-admin-setup--password-reset)
  - [Production & Reverse Proxy](#-production--reverse-proxy)
- [👨‍💻 توسعه‌دهنده / Author](#-توسعهدهنده--author)
- [📄 License](#-license)

---

# 🇮🇷 راهنمای فارسی

## 🎯 ایده و نحوه عملکرد
فروشگاه‌های فیزیکی و زنجیره‌ای (پوشاک، کافه، رستوران، طلافروشی، لوازم آرایشی و...) پوستر شکیل حاوی **QR Code اختصاصی** خود را پشت شیشه یا روی پیشخوان قرار می‌دهند.  
مشتریان با گوشی هوشمند خود کد را اسکن کرده، با وارد کردن نام و شماره تماس وارد گردونه شانس فروشگاه می‌شوند. پس از چرخش گردونه، جایزه یا درصد تخفیف برنده شده را به همراه **کد کوپن اختصاصی** دریافت می‌کنند. هم‌زمان، شماره مشتری در دیتابیس مغازه‌دار جهت اطلاع‌رسانی‌ها و کمپین‌های پیامکی ثبت می‌شود.

---

## ✨ ویژگی‌های کلیدی
- 🎡 **گردونه اختصاصی بومی با HTML5 Canvas:** عملکرد فوق‌العاده روان، انیمیشن چرخش پرسرعت کازینویی (Ease-Out)، لامپ‌های متحرک نئونی و صدای کلیک صوتی بدون وابستگی به کتابخانه‌های سنگین.
- 🖨️ **تولید خودکار پوستر و QR Code اختصاصی:** تولید بارکد اختصاصی با امکان دانلود فایل PNG یا **چاپ مستقیم پوستر شکیل و استاندارد** برای چسباندن روی شیشه فروشگاه.
- 🎨 **۳ تم بصری متفاوت و چشم‌نواز:**
  - **Starter:** مدرن، شاد و پرانرژی با تم تیره و رنگ‌های پویای نئونی.
  - **Luxury:** طراحی مشکی و طلایی سلطنتی مناسب جواهرفروشی‌ها، ساعت و گالری‌های لوکس.
  - **Neon:** استایل سایبرپانک با درخشش نور نئونی مناسب کافه‌ها و برندهای جوان‌پسند.
- 🖼️ **شخصی‌سازی و آپلود لوگو:** بارگذاری مستقیم نشان تجاری و لوگوی فروشگاه در بالای گردونه.
- 🛡️ **سیستم ضد تقلب و ابطال کوپن (Redeem System):** ثبت هر شانس به تفکیک فروشگاه و امکان ابطال کد تخفیف توسط فروشنده در پنل پس از استفاده مشتری.
- 📊 **خروجی اکسل (CSV) از شماره‌ها:** دریافت خروجی از تمامی لیدهای جذب‌شده برای کمپین‌های پیامکی و بازاریابی مجدد (Remarketing).

---

## 👥 نقش‌ها، صفحات و مسیرهای سامانه

| مسیر (URL) | عنوان | دسترسی و توضیحات |
| :--- | :--- | :--- |
| `/` | **صفحه اصلی (لندینگ)** | معرفی سامانه، مزایا، آمار و پیش‌نمایش زنده |
| `/[slug]` | **گردونه شانس فروشگاه** | صفحه اسکن شده توسط مشتری (مثلاً `/demo-store` یا `/gardone`) |
| `/login` | **صفحه ورود یکپارچه** | ورود صاحب فروشگاه یا ادمین کل با نمایش اطلاعات اکانت دمو |
| `/panel` | **پنل صاحب فروشگاه** | تنظیم جوایز و درصدها، دانلود QR، ثبت ابطال بن‌ها، خروجی شماره‌ها |
| `/admin` | **پنل سوپر ادمین** | ایجاد و فعال‌سازی فروشگاه‌ها، مدیریت تم‌ها و آمار سامانه |

---

## 🚀 راهنمای جامع نصب و راه‌اندازی

### پیش‌نیازها:
- **Node.js** نسخه `18.18+` یا `20+`
- **پایگاه‌داده MySQL** یا **MariaDB** (مانند XAMPP، سرور لینوکس یا دیتابیس cPanel)
- ابزار **Git**

### ۱. دریافت مخزن و نصب پکیج‌ها:
```bash
git clone https://github.com/asad-khalili-it/gardone.git
cd gardone
npm install
```

### ۲. تنظیم متغیرهای محیطی (`.env`):
یک فایل به نام `.env` در ریشه پروژه بسازید (یا فایل `.env.example` را کپی و تغییر دهید):

```env
# آدرس اتصال دیتابیس MySQL
# فرمت: mysql://نام_کاربری:رمز_عبور@آدرس_هاست:پورت/نام_دیتابیس
DATABASE_URL="mysql://root:@localhost:3306/gardone_db"

# کلید رمزنگاری نشست‌ها (یک متن تصادفی دلخواه)
NEXTAUTH_SECRET="gardone-super-secret-key-replace-this-with-random-hash"

# دامنه یا آدرس پروژه
NEXTAUTH_URL="https://gardone.yourdomain.ir"
```

### ۳. همگام‌سازی دیتابیس و جداول Prisma:
دستورات زیر ساختار دیتابیس را به صورت خودکار ایجاد و کلاینت پریزما را جنریت می‌کنند:
```bash
npx prisma db push
npx prisma generate
```

---

## 🔑 مدیریت و ریست رمز عبور ادمین

برای حفظ امنیت در مخزن عمومی، رمز عبور ثابتی برای مدیر کل وجود ندارد و اسکریپت امنیتی به صورت خودکار **رمز عبور تصادفی و پیچیده** تولید می‌کند.

### تولید ادمین اولیه یا ریست با رمز رندوم:
دستور زیر را در ترمینال اجرا کنید:
```bash
node scripts/create-admin.js
```
این اسکریپت یک رمز عبور تصادفی و امن (شامل حروف کوچک، بزرگ، اعداد و سیمبل‌ها) تولید کرده و اطلاعات را مستقیماً در ترمینال نمایش می‌دهد. همچنین فروشگاه دمو (`demo@store.com` / `demo123`) را نیز فعال می‌کند.

### تعیین یا ریست رمز عبور دلخواه برای ادمین:
اگر در هر زمان مایل بودید رمز مدیر کل را به رمز دلخواه خود تغییر دهید یا رمز را فراموش کردید، کافی است دستور زیر را با رمز جدید خود اجرا نمایید:
```bash
node scripts/create-admin.js "MyNewSecurePassword@2026"
```
*(اختیاری: می‌توانید ایمیل ادمین را نیز به عنوان آرگومان دوم تعیین کنید)*:
```bash
node scripts/create-admin.js "MyPassword@123" "admin@mydomain.ir"
```
> **نکته:** اجرای مجدد این دستور اطلاعات دیگر دیتابیس را پاک نمی‌کند؛ صرفاً رمز عبور مدیر کل را به‌روزرسانی (Upsert) می‌نماید.

---

## 🌐 تنظیمات پروداکشن (PM2 و وب سرور / cPanel)

### ۱. بیلد پروژه برای تولید (Production):
```bash
npm run build
```

### ۲. اجرا با مدیر پروسه PM2:
فایل `ecosystem.config.js` در پروژه آماده است. با دستور زیر پروژه را بر روی پورت اختصاصی (مثلاً 3042) اجرا کنید:
```bash
pm2 start ecosystem.config.js
pm2 save
```

### ۳. تنظیم معکوس (Reverse Proxy) در سی‌پنل (cPanel / Apache):
اگر پروژه روی هاست اشتراکی cPanel با وب‌سرور آپاچی قرار دارد، فایل `.htaccess` زیر در مسیر دامنه یا ساب‌دامین قرار داده شده تا ترافیک را به نودجی‌اس پورت 3042 هدایت کند:

```apache
DirectoryIndex disabled

RewriteEngine On
RewriteBase /

# پشتیبانی از WebSocket
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^(.*)$ ws://127.0.0.1:3042/$1 [P,L]

# هدایت ریشه و استاتیک‌ها
RewriteRule ^$ http://127.0.0.1:3042/ [P,L]
RewriteRule ^index\.(php|html?)$ http://127.0.0.1:3042/ [P,L]
RewriteRule ^_next/(.*)$ http://127.0.0.1:3042/_next/$1 [P,L]

# هدایت تمامی درخواست‌ها به پورت Next.js
RewriteRule ^(.*)$ http://127.0.0.1:3042/$1 [P,L]
```

---

# 🇬🇧 English Documentation

## 🌐 Overview
**Gardone** is a modern, turn-key retail engagement platform designed to bridge physical retail stores and digital marketing. Offline stores display a custom-designed **QR Code poster** at their counters or shop windows. Customers scan the QR code with their mobile devices, input their contact details, and spin a beautiful, high-fps lucky wheel to win store discounts and gifts.

---

## ⚡ Key Features
- **Native HTML5 Canvas Wheel:** Fluid 60fps spin animations, natural ease-out deceleration, neon LED borders, and realistic audio effects with zero external canvas library overhead.
- **Dynamic Poster & QR Code Engine:** Generates high-resolution store QR codes ready for instant PNG download or high-DPI direct printing.
- **3 Visual Themes:**
  - `Starter`: Energetic dark mode theme with neon accents.
  - `Luxury`: Royal gold and black theme tailored for jewelry, boutiques, and luxury brands.
  - `Neon`: Cyberpunk glowing theme ideal for modern coffee shops and youth brands.
- **Store Logo Uploader:** Upload and showcase your brand emblem directly on the lucky wheel.
- **Anti-Fraud & Redemption System:** Tracks customer wins per phone number and allows cashiers to redeem/invalidate used coupons.
- **Lead Collection & Excel (CSV) Export:** Collect customer names and phone numbers for SMS marketing and CRM integration.

---

## 🔐 Roles & Architecture

```
                    ┌────────────────────────┐
                    │      Super Admin       │  --> /admin
                    └───────────┬────────────┘
                                │
                    ┌───────────┴────────────┐
                    │      Store Owner       │  --> /panel
                    └───────────┬────────────┘
                                │
                    ┌───────────┴────────────┐
                    │     Store Customer     │  --> /[slug]
                    └────────────────────────┘
```

---

## 🛠️ Quick Start & Installation

```bash
# 1. Clone repository
git clone https://github.com/asad-khalili-it/gardone.git
cd gardone

# 2. Install dependencies
npm install

# 3. Setup environment variables (.env)
cp .env.example .env
# Edit DATABASE_URL, NEXTAUTH_SECRET, and NEXTAUTH_URL

# 4. Synchronize Prisma Database schema
npx prisma db push
npx prisma generate

# 5. Build and launch development server
npm run dev
```

---

## 🔑 Admin Setup & Password Reset

To ensure production security, `create-admin.js` dynamically generates a cryptographically secure random password every time it runs.

```bash
# Generate admin with secure random password (printed in terminal):
node scripts/create-admin.js

# Or set / reset with a custom password:
node scripts/create-admin.js "YourStrongPassword@123"

# Or with custom email and password:
node scripts/create-admin.js "YourStrongPassword@123" "custom-admin@domain.com"
```

> **Note:** Running `node scripts/create-admin.js` performs an upsert operation. It will safely update the existing admin password without modifying any other data.

---

## 🚢 Production & Reverse Proxy

```bash
# Build production bundle
npm run build

# Start with PM2 using ecosystem.config.js
pm2 start ecosystem.config.js
pm2 save
```

---

## 👨‍💻 توسعه‌دهنده / Author
- **اسد خلیلی (Asad Khalili)**
- وب‌سایت شخصی: [https://asadkhalili.ir](https://asadkhalili.ir)
- گیت‌هاب: [@asad-khalili-it](https://github.com/asad-khalili-it)

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
