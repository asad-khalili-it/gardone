const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// Helper to generate cryptographically strong random password
function generateRandomPassword(length = 14) {
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  const allChars = lower + upper + numbers + symbols;

  // Guarantee at least one from each group
  let password = [
    lower[crypto.randomInt(0, lower.length)],
    upper[crypto.randomInt(0, upper.length)],
    numbers[crypto.randomInt(0, numbers.length)],
    symbols[crypto.randomInt(0, symbols.length)],
  ];

  for (let i = password.length; i < length; i++) {
    password.push(allChars[crypto.randomInt(0, allChars.length)]);
  }

  // Shuffle array using Fisher-Yates
  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}

async function main() {
  // Command line args or env vars:
  // Usage: node scripts/create-admin.js [optional_custom_password] [optional_email]
  const customPasswordArg = process.argv[2];
  const customEmailArg = process.argv[3];

  const adminEmail = customEmailArg || process.env.ADMIN_EMAIL || 'admin@gardone.ir';
  const adminPassword = customPasswordArg || process.env.ADMIN_PASSWORD || generateRandomPassword(14);
  const adminName = 'مدیر کل سامانه گردونه';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  // Upsert Super Admin (creates if not exists, updates password if already exists -> Acts as Password Reset)
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

  // Seed / Upsert Demo Store Owner
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

  console.log('\n====================================================');
  console.log('✅ ۱. اطلاعات ورود مدیر کل سامانه (Super Admin):');
  console.log(`👤 نام: ${admin.name}`);
  console.log(`📧 ایمیل: ${admin.email}`);
  console.log(`🔑 رمز عبور: ${adminPassword}`);
  console.log(`🔗 مسیر ورود به پنل مدیریت: /admin`);
  console.log('----------------------------------------------------');
  console.log('💡 نکته امنیتی:');
  console.log('رمز عبور مدیر به صورت تصادفی و امن تولید شده است.');
  console.log('برای ریست رمز یا تعیین رمز دلخواه، می‌توانید مجدداً دستور زیر را بزنید:');
  console.log('👉 node scripts/create-admin.js [رمز_جدید_دلخواه]');
  console.log('----------------------------------------------------');
  console.log('✅ ۲. اطلاعات ورود فروشگاه دمو (Store Owner):');
  console.log(`🏪 نام فروشگاه: ${demoStore.name}`);
  console.log(`📧 ایمیل: ${demoEmail}`);
  console.log(`🔑 رمز عبور: ${demoPassword}`);
  console.log(`🔗 مسیر پنل فروشگاه: /panel`);
  console.log('====================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ خطا در ارتباط با دیتابیس:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
