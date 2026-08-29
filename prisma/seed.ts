import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Wiratmadja database...');

  // 1. Create Admin Account (Wiratmadja Owner)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wiratmadja.id' },
    update: {},
    create: {
      name: 'Bapak Wiratmadja (Admin/Pemilik)',
      email: 'admin@wiratmadja.id',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Create Contributor Account (Family Member)
  const contributorPassword = await bcrypt.hash('keluarga123', 10);
  const contributor = await prisma.user.upsert({
    where: { email: 'keluarga@wiratmadja.id' },
    update: {},
    create: {
      name: 'Aditya Wiratmadja (Kontributor)',
      email: 'keluarga@wiratmadja.id',
      password: contributorPassword,
      role: 'CONTRIBUTOR',
    },
  });

  console.log('Created users:', { admin: admin.email, contributor: contributor.email });

  // 3. Create Product Categories
  const categories = [
    {
      name: 'Sembako & Dapur Utama',
      slug: 'sembako-dapur-utama',
      description: 'Kebutuhan pokok beras premium, minyak goreng murni, dan gula kualitas pilihan.',
      icon: 'ShoppingBag',
    },
    {
      name: 'Minuman Organic & Herbal',
      slug: 'minuman-organic-herbal',
      description: 'Teh herbal organik, kopi nusantara, dan olahan madu murni alami.',
      icon: 'Coffee',
    },
    {
      name: 'Bumbu & Rempah Kurasi',
      slug: 'bumbu-rempah-kurasi',
      description: 'Bumbu olahan keluarga khas Wiratmadja, rempah kering utuh tanpa bahan pengawet.',
      icon: 'Utensils',
    },
    {
      name: 'Camilan Tradisional Warmth',
      slug: 'camilan-tradisional',
      description: 'Kue kering renyah, keripik olahan rumahan, dan jajanan khas istimewa.',
      icon: 'Cookie',
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const sembakoCategory = await prisma.category.findUnique({ where: { slug: 'sembako-dapur-utama' } });
  const minumanCategory = await prisma.category.findUnique({ where: { slug: 'minuman-organic-herbal' } });
  const bumbuCategory = await prisma.category.findUnique({ where: { slug: 'bumbu-rempah-kurasi' } });
  const camilanCategory = await prisma.category.findUnique({ where: { slug: 'camilan-tradisional' } });

  // 4. Create Initial Products with Rich Descriptions and Variants
  const products = [
    {
      title: 'Beras Pandan Wangi Premium Wiratmadja',
      slug: 'beras-pandan-wangi-premium',
      description: 'Beras organik dari sawah dataran tinggi terpilih. Bulir utuh, harum alami tanpa pewangi buatan, dan pulen sempurna saat dimasak.',
      price: 85000,
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
      categoryId: sembakoCategory!.id,
      isFeatured: true,
      variants: [
        { name: 'Kemasan', value: '5 Kg', price: 85000, stock: 30 },
        { name: 'Kemasan', value: '10 Kg', price: 165000, stock: 15 },
      ],
    },
    {
      title: 'Miyak Goreng Kelapa Murni Cold-Pressed',
      slug: 'minyak-goreng-kelapa-murni',
      description: 'Miyak kelapa murni tanpa proses pemutih kimia. Lebih sehat untuk tumisan dan penggorengan keluarga.',
      price: 38000,
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
      categoryId: sembakoCategory!.id,
      isFeatured: true,
      variants: [
        { name: 'Ukuran Botol', value: '1 Liter', price: 38000, stock: 40 },
        { name: 'Ukuran Botol', value: '2 Liter', price: 72000, stock: 20 },
      ],
    },
    {
      title: 'Madu Hutan Liar Murni Wiratmadja Heritage',
      slug: 'madu-hutan-liar-murni',
      description: 'Madu mentah (raw honey) langsung diolah secara tradisional tanpa pengental atau tambahan gula.',
      price: 125000,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800',
      categoryId: minumanCategory!.id,
      isFeatured: true,
      variants: [
        { name: 'Ukuran Jar', value: '350 ml', price: 125000, stock: 15 },
        { name: 'Ukuran Jar', value: '650 ml', price: 220000, stock: 10 },
      ],
    },
    {
      title: 'Kopi Arabika Gayo Dark Roast Special Edition',
      slug: 'kopi-arabika-gayo-dark-roast',
      description: 'Biji kopi pilihan dengan profil rasa nutty, karamel lembut, dan keasaman rendah yang nyaman di perut.',
      price: 65000,
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
      categoryId: minumanCategory!.id,
      isFeatured: false,
      variants: [
        { name: 'Bentuk', value: 'Biji Utuh (Whole Bean) 250g', price: 65000, stock: 20 },
        { name: 'Bentuk', value: 'Giling Halus (Espresso) 250g', price: 65000, stock: 15 },
      ],
    },
    {
      title: 'Racikan Bumbu Rendang Warisan Wiratmadja',
      slug: 'bumbu-rendang-warisan-wiratmadja',
      description: 'Bumbu basah otentik siap pakai terbuat dari rempah-rempah sangrai berkualitas tanpa bahan pengawet sintesis.',
      price: 32000,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
      categoryId: bumbuCategory!.id,
      isFeatured: true,
      variants: [
        { name: 'Porsi Rendang', value: '500gr Daging', price: 32000, stock: 30 },
        { name: 'Porsi Rendang', value: '1kg Daging', price: 58000, stock: 20 },
      ],
    },
    {
      title: 'Keripik Tempe Renyah Bumbu Ketumbar Sangrai',
      slug: 'keripik-tempe-renyah-ketumbar',
      description: 'Keripik tempe tipis gurih dibuat dengan minyak nabati jernih dan balutan aroma ketumbar alami.',
      price: 22000,
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800',
      categoryId: camilanCategory!.id,
      isFeatured: false,
      variants: [
        { name: 'Rasa', value: 'Original Ketumbar 200g', price: 22000, stock: 50 },
        { name: 'Rasa', value: 'Pedas Manis Daun Jeruk 200g', price: 24000, stock: 30 },
      ],
    },
  ];

  for (const prod of products) {
    const { variants, ...productData } = prod;
    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: productData,
      create: productData,
    });

    // Clear existing variants and re-create
    await prisma.productVariant.deleteMany({ where: { productId: createdProd.id } });
    for (const v of variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProd.id,
          name: v.name,
          value: v.value,
          price: v.price,
          stock: v.stock,
        },
      });
    }
  }

  // 5. Audit Log Seed
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'INITIAL_SEED',
      details: 'Menginisialisasi katalog produk awal Wiratmadja dan kategori keluarga.',
    },
  });

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
