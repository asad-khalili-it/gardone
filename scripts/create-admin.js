const fs = require('fs');
const path = require('path');

// 1. Manually parse .env from project root if not already in process.env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

// 2. Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('\n❌ خطا: متغیر DATABASE_URL پیدا نشد!');
  console.error('فایل .env در ریشه پروژه وجود ندارد یا فاقد DATABASE_URL است.');
  console.error('نمونه فرمت اتصال دیتابیس در فایل .env :');
  console.error('DATABASE_URL="mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME"\n');
  process.exit(1);
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Seed / Upsert Super Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@asadkhalili.ir';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Asad@Gardone!2026';
  const adminName = 'اسد خلیلی (مدیر کل)';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      name: adminName,
      role: 'super_admin'
    },
    create: {
      email: adminEmail,
      password: hashedAdminPassword,
      name: adminName,
      role: 'super_admin'
    }
  });

  // 2. Seed / Upsert Demo Store Owner
  const demoEmail = 'demo@store.com';
  const demoPassword = 'demo123';
  const hashedDemoPassword = await bcrypt.hash(demoPassword, 10);

  const demoStore = await prisma.store.upsert({
    where: { ownerEmail: demoEmail },
    update: {
      ownerPassword: hashedDemoPassword,
      isActive: true,
      name: 'فروشگاه نمونه (دمو)',
      slug: 'demo-store'
    },
    create: {
      name: 'فروشگاه نمونه (دمو)',
      slug: 'demo-store',
      ownerName: 'مدیر فروشگاه دمو',
      ownerEmail: demoEmail,
      ownerPhone: '09120000000',
      ownerPassword: hashedDemoPassword,
      isActive: true,
      theme: 'starter',
      address: 'تهران، خیابان ولیعصر',
      instagram: '@demo_store'
    }
  });

  console.log('====================================================');
  console.log('✅ ۱. اطلاعات ورود مدیر کل سامانه (Super Admin):');
  console.log(`👤 نام: ${admin.name}`);
  console.log(`📧 ایمیل: ${admin.email}`);
  console.log(`🔑 رمز عبور: ${adminPassword}`);
  console.log(`🔗 مسیر پنل: /admin`);
  console.log('----------------------------------------------------');
  console.log('✅ ۲. اطلاعات ورود فروشگاه دمو (Store Owner):');
  console.log(`🏪 نام فروشگاه: ${demoStore.name}`);
  console.log(`📧 ایمیل: ${demoEmail}`);
  console.log(`🔑 رمز عبور: ${demoPassword}`);
  console.log(`🔗 مسیر پنل: /panel`);
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('❌ خطا در ارتباط با دیتابیس:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
