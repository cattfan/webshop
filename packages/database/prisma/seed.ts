import { PrismaClient, DeliveryType, ProductStatus } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const PERMISSIONS = [
  'users.manage',
  'roles.manage',
  'products.manage',
  'inventory.manage',
  'orders.view.all',
  'orders.assign',
  'orders.fulfill',
  'orders.refund',
  'payments.config',
  'payments.view',
  'warranty.decide',
  'audit.view',
  'settings.manage',
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: PERMISSIONS,
  OPERATOR: ['orders.fulfill'],
  CUSTOMER: [],
};

async function main() {
  // Permissions
  const permissions = await Promise.all(
    PERMISSIONS.map((key) =>
      prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key },
      }),
    ),
  );
  const permByKey = new Map(permissions.map((p) => [p.key, p]));

  // Roles + role-permission links
  for (const roleName of Object.keys(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    for (const permKey of ROLE_PERMISSIONS[roleName] ?? []) {
      const perm = permByKey.get(permKey);
      if (!perm) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  // Admin user (password from env; dev fallback only outside production)
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@webshop.local';
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ??
    (process.env.NODE_ENV === 'production' ? '' : 'ChangeMe123!');
  if (!adminPassword) {
    throw new Error('SEED_ADMIN_PASSWORD is required in production');
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN' } });
  const passwordHash = await argon2.hash(adminPassword, { type: argon2.argon2id });
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      displayName: 'Administrator',
      locale: 'vi',
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  });

  // Sample category + product + variant with translations
  const category = await prisma.category.upsert({
    where: { slug: 'streaming' },
    update: {},
    create: {
      slug: 'streaming',
      sortOrder: 1,
      translations: {
        create: [
          { locale: 'en', name: 'Streaming' },
          { locale: 'cn', name: '流媒体' },
        ],
      },
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: 'sample-pro-account' },
    update: {},
    create: {
      slug: 'sample-pro-account',
      deliveryType: DeliveryType.INSTANT_ACCOUNT,
      status: ProductStatus.ACTIVE,
      categoryId: category.id,
      basePriceUsd: '9.990000',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Sample Pro Account',
            shortDesc: 'Demo instant-delivery account.',
            longDesc: 'A sample product seeded for development.',
          },
          {
            locale: 'cn',
            name: '示例专业账户',
            shortDesc: '演示即时交付账户。',
          },
        ],
      },
    },
  });

  await prisma.productVariant.upsert({
    where: { sku: 'SAMPLE-PRO-1M' },
    update: {},
    create: {
      productId: product.id,
      sku: 'SAMPLE-PRO-1M',
      priceUsd: '9.990000',
      durationDays: 30,
      translations: {
        create: [
          { locale: 'en', name: '1 Month' },
          { locale: 'cn', name: '1个月' },
        ],
      },
    },
  });

  console.log('Seed complete. Admin:', adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
