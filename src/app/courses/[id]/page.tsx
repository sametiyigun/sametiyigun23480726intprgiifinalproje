'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Course {
  id: number
  title: string
  description: string
  price: number
  duration: number | null
  level: string
  imageUrl: string | null
  isActive: boolean
  category: {
    id: number
    name: string
    color: string | null
  }
  instructor: {
    id: number
    name: string
  }
  _count: {
    enrollments: number
  }
}

interface CourseContent {
  id: number
  title: string
  description: string
  type: 'video' | 'text' | 'quiz'
  content: string
  duration?: number
  order: number
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [contents, setContents] = useState<CourseContent[]>([])
  const [selectedContent, setSelectedContent] = useState<CourseContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
        setContents(data.contents)
        setIsEnrolled(data.isEnrolled)
        if (data.contents.length > 0) {
          setSelectedContent(data.contents[0])
        }
      } else {
        setError('Kurs bulunamadı')
      }
    } catch (error) {
      setError('Sunucu hatası oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const enrollToCourse = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: parseInt(params.id) }),
      })

      if (response.ok) {
        setIsEnrolled(true)
        fetchCourse()
      } else {
        const data = await response.json()
        setError(data.error || 'Kayıt olurken hata oluştu')
      }
    } catch (error) {
      setError('Sunucu hatası oluştu')
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Başlangıç'
      case 'intermediate': return 'Orta'
      case 'advanced': return 'İleri'
      default: return level
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥'
      case 'text': return '📝'
      case 'quiz': return '❓'
      default: return '📄'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">❌</p>
          <p className="text-gray-600 mb-4">{error || 'Kurs bulunamadı'}</p>
          <Link 
            href="/courses" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Kurslara Geri Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                EduPlatform
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                Kurslar
              </Link>
              {session ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Profil
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-screen">
        {/* Sidebar - Course Contents */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                  {getLevelText(course.level)}
                </span>
                <span className="text-sm text-gray-500">
                  👨‍🏫 {course.instructor.name}
                </span>
                {course.duration && (
                  <span className="text-sm text-gray-500">
                    ⏱️ {course.duration} saat
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">
                  {course.price === 0 ? 'Ücretsiz' : `₺${course.price}`}
                </span>
                <span className="text-sm text-gray-500">
                  👥 {course._count.enrollments} kayıtlı
                </span>
              </div>

              {!isEnrolled && session && (
                <button
                  onClick={enrollToCourse}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
                >
                  Kursa Kayıt Ol
                </button>
              )}

              {isEnrolled && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                  ✅ Bu kursa kayıtlısınız
                </div>
              )}

              {!session && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4">
                  ⚠️ İçerikleri görmek için giriş yapın
                </div>
              )}
            </div>

            {/* Course Contents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kurs İçeriği ({contents.length} Bölüm)
              </h3>
              
              {contents.length === 0 ? (
                <p className="text-gray-500 text-sm">İçerik henüz eklenmemiş.</p>
              ) : (
                <div className="space-y-2">
                  {contents.map((content) => (
                    <div
                      key={content.id}
                      onClick={() => setSelectedContent(content)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContent?.id === content.id 
                          ? 'bg-blue-100 border-blue-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getContentIcon(content.type)}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {content.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {content.description}
                          </p>
                          {content.duration && (
                            <span className="text-xs text-gray-400">
                              {content.duration} dk
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white overflow-y-auto">
          {selectedContent && (session && (isEnrolled || course.price === 0)) ? (
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getContentIcon(selectedContent.type)}</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedContent.title}
                  </h2>
                </div>
                <p className="text-gray-600">{selectedContent.description}</p>
              </div>

              <div className="prose max-w-none">
                {selectedContent.type === 'video' && (
                  <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
                    <div className="text-4xl mb-4">🎥</div>
                    <p className="text-gray-600">Video Player (Demo)</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Gerçek uygulamada burada video oynatıcı olacak
                    </p>
                  </div>
                )}

                {selectedContent.type === 'quiz' && (
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <div className="text-3xl mb-4 text-center">❓</div>
                    <h3 className="font-semibold mb-4">Quiz Demo</h3>
                    <p className="text-gray-600 mb-4">
                      Gerçek uygulamada burada interaktif quiz olacak
                    </p>
                  </div>
                )}

                <div className="bg-white rounded-lg">
                  <div 
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedContent.content }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-4">🔒</p>
                <p className="text-xl text-gray-600 mb-2">İçerik Kilitli</p>
                <p className="text-gray-500">
                  {!session 
                    ? 'İçerikleri görmek için giriş yapın'
                    : !isEnrolled 
                      ? 'İçerikleri görmek için kursa kayıt olun'
                      : 'Bir içerik seçin'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 