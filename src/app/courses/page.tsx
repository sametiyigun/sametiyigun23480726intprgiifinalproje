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

export default function CoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      } else {
        setError('Kurslar yüklenirken hata oluştu')
      }
    } catch (error) {
      setError('Sunucu hatası oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const enrollToCourse = async (courseId: number) => {
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
        body: JSON.stringify({ courseId }),
      })

      if (response.ok) {
        setSuccess('Kursa başarıyla kayıt oldunuz!')
        fetchCourses() // Listeyi güncelle
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
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
                  <Link 
                    href="/messages" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Mesajlar
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

      {/* Courses Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Tüm Kurslar
            </h1>
            {session?.user?.role === 'admin' && (
              <Link
                href="/admin/courses/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Yeni Kurs Ekle
              </Link>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Courses Grid */}
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-4">📚</p>
              <p className="text-gray-500">Henüz kurs bulunmuyor.</p>
              {session?.user?.role === 'admin' && (
                <Link
                  href="/admin/courses/new"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  İlk Kursu Ekle
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
                  {course.imageUrl && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: course.category.color + '20',
                          color: course.category.color || '#374151'
                        }}
                      >
                        {course.category.name}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {getLevelText(course.level)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>👨‍💻 {course.instructor.name}</span>
                        {course.duration && (
                          <span>⏱️ {course.duration} saat</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>👥 {course._count.enrollments} kayıt</span>
                        <span className="text-lg font-bold text-blue-600">
                          {course.price === 0 ? 'Ücretsiz' : `₺${course.price}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        href={`/courses/${course.id}`}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 text-center text-sm"
                      >
                        Detayları Gör
                      </Link>
                      <button
                        onClick={() => enrollToCourse(course.id)}
                        disabled={!session}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                      >
                        {!session ? 'Giriş Yapın' : 'Kayıt Ol'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 