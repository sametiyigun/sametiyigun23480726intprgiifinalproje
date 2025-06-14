import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const enrollmentSchema = z.object({
  courseId: z.number(),
})

// POST - Kursa kayıt ol
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validation
    const validatedFields = enrollmentSchema.safeParse(body)
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Geçersiz form verileri' },
        { status: 400 }
      )
    }

    const { courseId } = validatedFields.data

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Kurs var mı kontrol et
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Kurs bulunamadı' },
        { status: 404 }
      )
    }

    if (!course.isActive) {
      return NextResponse.json(
        { error: 'Bu kurs aktif değil' },
        { status: 400 }
      )
    }

    // Zaten kayıtlı mı kontrol et
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: currentUser.id,
          courseId: courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Bu kursa zaten kayıtlısınız' },
        { status: 400 }
      )
    }

    // Kayıt oluştur
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: currentUser.id,
        courseId: courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Kursa başarıyla kayıt oldunuz',
      enrollment
    }, { status: 201 })

  } catch (error) {
    console.error('Enrollment POST error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    )
  }
} 