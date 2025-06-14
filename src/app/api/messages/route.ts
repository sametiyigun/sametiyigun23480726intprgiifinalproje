import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const sendMessageSchema = z.object({
  receiverId: z.number(),
  content: z.string().min(1, 'Mesaj içeriği boş olamaz').max(1000, 'Mesaj çok uzun'),
})

// GET - Mesajları getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    let messages

    if (userId) {
      // Belirli bir kullanıcıyla olan mesajları getir
      messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: currentUser.id,
              receiverId: parseInt(userId)
            },
            {
              senderId: parseInt(userId),
              receiverId: currentUser.id
            }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    } else {
      // Kullanıcının tüm mesajlarını getir
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUser.id },
            { receiverId: currentUser.id }
          ]
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    return NextResponse.json(messages)

  } catch (error) {
    console.error('Messages GET error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    )
  }
}

// POST - Mesaj gönder
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
    const validatedFields = sendMessageSchema.safeParse(body)
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Geçersiz form verileri', details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { receiverId, content } = validatedFields.data

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Alıcı kullanıcı var mı kontrol et
    const receiverUser = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiverUser) {
      return NextResponse.json(
        { error: 'Alıcı kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Kendi kendine mesaj gönderme kontrolü
    if (currentUser.id === receiverId) {
      return NextResponse.json(
        { error: 'Kendinize mesaj gönderemezsiniz' },
        { status: 400 }
      )
    }

    // Mesajı oluştur
    const message = await prisma.message.create({
      data: {
        content,
        senderId: currentUser.id,
        receiverId: receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(message, { status: 201 })

  } catch (error) {
    console.error('Messages POST error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    )
  }
} 