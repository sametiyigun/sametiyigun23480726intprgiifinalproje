import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Veritabanı verilerini oluşturuyor...')

  // Admin kullanıcı oluştur
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin Kullanıcı',
      password: hashedAdminPassword,
      role: 'admin',
      bio: 'Sistem yöneticisi',
    },
  })

  // Normal kullanıcılar oluştur
  const hashedUserPassword = await bcrypt.hash('user123', 10)
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'Ahmet Yılmaz',
      password: hashedUserPassword,
      bio: 'React öğrenmeye meraklı yazılımcı',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'Ayşe Kaya',
      password: hashedUserPassword,
      bio: 'Frontend geliştirici',
    },
  })

  // Kategoriler oluştur
  const webDevCategory = await prisma.category.create({
    data: {
      name: 'Web Geliştirme',
      description: 'Modern web teknolojileri ile uygulama geliştirme',
      color: '#3B82F6',
    },
  })

  const mobileCategory = await prisma.category.create({
    data: {
      name: 'Mobil Geliştirme',
      description: 'iOS ve Android uygulama geliştirme',
      color: '#10B981',
    },
  })

  // Kurslar oluştur
  const course1 = await prisma.course.create({
    data: {
      title: 'React ile Modern Web Geliştirme',
      description: 'React, Next.js ve TypeScript ile modern web uygulamaları geliştirmeyi öğrenin',
      price: 299.99,
      duration: 40,
      level: 'beginner',
      categoryId: webDevCategory.id,
      instructorId: admin.id,
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Node.js Backend Geliştirme',
      description: 'Node.js, Express ve MongoDB ile backend API geliştirme',
      price: 399.99,
      duration: 35,
      level: 'intermediate',
      categoryId: webDevCategory.id,
      instructorId: admin.id,
    },
  })

  // Kurs kayıtları oluştur
  await prisma.enrollment.create({
    data: {
      userId: user1.id,
      courseId: course1.id,
      progress: 25,
    },
  })

  await prisma.enrollment.create({
    data: {
      userId: user2.id,
      courseId: course1.id,
      progress: 50,
    },
  })

  // Örnek mesajlar oluştur
  await prisma.message.create({
    data: {
      content: 'Merhaba! React kursu hakkında bir sorum vardı.',
      senderId: user1.id,
      receiverId: admin.id,
    },
  })

  await prisma.message.create({
    data: {
      content: 'Tabii ki! Nasıl yardımcı olabilirim?',
      senderId: admin.id,
      receiverId: user1.id,
    },
  })

  console.log('✅ Demo veriler başarıyla oluşturuldu!')
  console.log('👤 Admin giriş bilgileri:')
  console.log('   Email: admin@example.com')
  console.log('   Şifre: admin123')
  console.log('👤 Kullanıcı giriş bilgileri:')
  console.log('   Email: user1@example.com')
  console.log('   Şifre: user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 