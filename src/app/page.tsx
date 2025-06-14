'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">📚</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">EduPlatform</span>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-gray-700">Hoş geldiniz, {session.user?.name}!</span>
                  <Link 
                    href="/dashboard" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Dashboard
                  </Link>
                </>
                             ) : (
                 <>
                   <Link 
                     href="/courses" 
                     className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                   >
                     Kurslar
                   </Link>
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Öğrenmeye Başlayın</span>
            <span className="block text-blue-600">Geleceği Şekillendirin</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Modern teknolojiler ile hazırlanmış profesyonel kurslarla becerilerinizi geliştirin. 
            Uzman eğitmenlerden öğrenin ve kariyerinizi bir üst seviyeye taşıyın.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {!session && (
              <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Hemen Başlayın
                </Link>
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                >
                  Giriş Yapın
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="py-12">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Özellikler</h2>
            <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                                            <div>
                 <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                   <span className="text-xl">📖</span>
                 </div>
                 <div className="text-center">
                   <dt className="mt-5 text-lg leading-6 font-medium text-gray-900">
                     Zengin Kurs İçerikleri
                   </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Web geliştirme, mobil uygulama, veri analizi ve daha fazlası. 
                    Her seviyeden öğrenci için uygun içerikler.
                  </dd>
                </div>
              </div>

                                            <div>
                 <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                   <span className="text-xl">👨‍💻</span>
                 </div>
                 <div className="text-center">
                   <dt className="mt-5 text-lg leading-6 font-medium text-gray-900">
                     Uzman Eğitmenler
                   </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Sektörde deneyimli, alanında uzman eğitmenlerden öğrenin. 
                    Gerçek projeler üzerinde çalışın.
                  </dd>
                </div>
              </div>

                                            <div>
                 <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                   <span className="text-xl">⭐</span>
                 </div>
                 <div className="text-center">
                   <dt className="mt-5 text-lg leading-6 font-medium text-gray-900">
                     Kişiselleştirilmiş Deneyim
                   </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    İlerlemenizi takip edin, hedeflerinize odaklanın. 
                    Size özel öneriler alın.
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        {/* Demo Bilgileri (sadece giriş yapmamış kullanıcılar için) */}
        {!session && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Demo Hesaplar</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-900">👤 Admin Hesabı</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Email: admin@example.com<br />
                  Şifre: admin123
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Tüm sistem özelliklerine erişim
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <h4 className="font-medium text-green-900">👤 Kullanıcı Hesabı</h4>
                <p className="text-sm text-green-700 mt-1">
                  Email: user1@example.com<br />
                  Şifre: user123
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Standart kullanıcı özellikleri
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
