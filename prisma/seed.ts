import { PrismaClient } from '../src/generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);

  // Admin kullanıcısını ekle veya güncelle
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ags.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@ags.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin kullanıcısı hazır:', admin.email);

  // Türkçe Kategorisi
  const turkce = await prisma.category.upsert({
    where: { name: 'Türkçe' },
    update: {},
    create: {
      name: 'Türkçe',
      description: 'Paragraf, Sözcükte Anlam, Cümlede Anlam ve Dil Bilgisi konuları.',
      icon: 'BookOpen',
    },
  });

  // Mevzuat Kategorisi
  const mevzuat = await prisma.category.upsert({
    where: { name: 'Mevzuat' },
    update: {},
    create: {
      name: 'Mevzuat',
      description: '1982 Anayasası, 1739, 222 ve 7528 Sayılı Kanunlar.',
      icon: 'FileText',
    },
  });

  console.log('Kategoriler oluşturuldu.');

  // Türkçe Kartı (Önceden var değilse ekle)
  const turkceCardCount = await prisma.card.count({
    where: { categoryId: turkce.id },
  });
  if (turkceCardCount === 0) {
    await prisma.card.create({
      data: {
        question: 'Paragrafta Ana Düşünce nedir?',
        answer: 'Yazarın okuyucuya vermek istediği temel mesaj veya ana iletidir.',
        categoryId: turkce.id,
      },
    });
  }

  // Mevzuat Kartı (Önceden var değilse ekle)
  const mevzuatCardCount = await prisma.card.count({
    where: { categoryId: mevzuat.id },
  });
  if (mevzuatCardCount === 0) {
    await prisma.card.create({
      data: {
        question: "1982 Anayasası'na göre yasama yetkisi kime aittir?",
        answer: 'Türkiye Büyük Millet Meclisi (TBMM) adına Türk Milletine aittir.',
        categoryId: mevzuat.id,
      },
    });
  }

  console.log('Test bilgi kartları oluşturuldu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
