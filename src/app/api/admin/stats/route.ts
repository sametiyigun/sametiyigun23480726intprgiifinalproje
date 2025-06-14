import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

// GET - Admin istatistikleri getir
export async function GET(request: NextRequest) {
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

    // İstatistikleri paralel olarak getir
    const [
      totalUsers,
      totalMessages,
      totalCourses,
      totalEnrollments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.message.count(),
      prisma.course.count(),
      prisma.enrollment.count()
    ])

    const stats = {
      totalUsers,
      totalMessages,
      totalCourses,
      totalEnrollments
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Admin stats GET error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    )
  }
} 