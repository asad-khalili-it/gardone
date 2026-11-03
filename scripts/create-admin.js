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
  const email = process.env.ADMIN_EMAIL || 'admin@asadkhalili.ir';
  const password = process.env.ADMIN_PASSWORD || 'Asad@Gardone!2026';
  const name = 'اسد خلیلی (مدیر کل)';

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name,
      role: 'super_admin'
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: 'super_admin'
    }
  });

  console.log('--------------------------------------------------');
  console.log('✅ حساب مدیر کل با موفقیت ایجاد / به‌روزرسانی شد:');
  console.log(`👤 نام: ${admin.name}`);
  console.log(`📧 ایمیل: ${admin.email}`);
  console.log(`🔑 رمز عبور: ${password}`);
  console.log(`🛡 نقش: ${admin.role}`);
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ خطا در ارتباط با دیتابیس:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
