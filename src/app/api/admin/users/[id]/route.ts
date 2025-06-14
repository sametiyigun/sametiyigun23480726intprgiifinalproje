import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateUserSchema = z.object({
  role: z.enum(['user', 'admin']),
})

// PUT - Kullanıcı rolünü güncelle (sadece admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    // Admin kontrolü
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      )
    }

    const { id } = await params;
    const userId = parseInt(id)
    const body = await request.json()

    // Validation
    const validatedFields = updateUserSchema.safeParse(body)
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Geçersiz form verileri' },
        { status: 400 }
      )
    }

    const { role } = validatedFields.data

    // Kendi rolünü değiştirmeye çalışıyor mu?
    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: 'Kendi rolünüzü değiştiremezsiniz' },
        { status: 400 }
      )
    }

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error('Admin user PUT error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Kullanıcıyı sil (sadece admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    // Admin kontrolü
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      )
    }

    const { id } = await params;
    const userId = parseInt(id)

    // Kendini silmeye çalışıyor mu?
    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: 'Kendinizi silemezsiniz' },
        { status: 400 }
      )
    }

    // İlişkili verileri silmek için transaction kullan
    await prisma.$transaction(async (tx) => {
      // Önce mesajları sil
      await tx.message.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      })

      // Kurs kayıtlarını sil
      await tx.enrollment.deleteMany({
        where: { userId: userId }
      })

      // Kullanıcının oluşturduğu kursları başka birisine ata veya sil
      // Bu örnekte sadece siliyoruz
      await tx.course.deleteMany({
        where: { instructorId: userId }
      })

      // Son olarak kullanıcıyı sil
      await tx.user.delete({
        where: { id: userId }
      })
    })

    return NextResponse.json({ message: 'Kullanıcı başarıyla silindi' })

  } catch (error) {
    console.error('Admin user DELETE error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    )
  }
} 