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

  console.log('-------------------------------------------');
  console.log('✅ حساب مدیر کل با موفقیت ایجاد / به‌روزرسانی شد:');
  console.log(`👤 نام: ${admin.name}`);
  console.log(`📧 ایمیل: ${admin.email}`);
  console.log(`🔑 رمز عبور: ${password}`);
  console.log(`🛡 نقش: ${admin.role}`);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ خطا در ایجاد ادمین:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
