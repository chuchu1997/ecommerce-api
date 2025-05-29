import { PrismaClient, Role } from '@prisma/client';

import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // Cờ bảo vệ: bạn phải đặt biến môi trường ADMIN_CREATE=1 mới chạy
  if (process.env.ADMIN_CREATE !== '1') {
    console.log(
      '⛔ Script bị chặn. Đặt biến môi trường ADMIN_CREATE=1 để chạy.',
    );
    process.exit(0);
  }

  const email = process.env.EMAIL_ADMIN || '';
  const password = process.env.PASSWORD_ADMIN || '';

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('⚠️ Admin đã tồn tại.');
    return;
  }
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'admin',
      phone: '0325805893',
      address: 'SOMETHING !!!',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Admin đã được tạo:', admin);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi tạo admin:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
