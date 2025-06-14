'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: number
  name: string
  email: string
  avatar: string | null
}

interface Message {
  id: number
  content: string
  isRead: boolean
  createdAt: string
  sender: User
  receiver: User
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messageContent, setMessageContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchUsers()
      fetchMessages()
    }
  }, [status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Users fetch error:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Messages fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessagesWithUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('User messages fetch error:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !messageContent.trim()) return

    setIsSending(true)
    setError('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: messageContent.trim(),
        }),
      })

      if (response.ok) {
        setMessageContent('')
        await fetchMessagesWithUser(selectedUser.id)
      } else {
        const data = await response.json()
        setError(data.error || 'Mesaj gönderilirken hata oluştu')
      }
    } catch (error) {
      setError('Sunucu hatası oluştu')
    } finally {
      setIsSending(false)
    }
  }

  const selectUser = (user: User) => {
    setSelectedUser(user)
    fetchMessagesWithUser(user.id)
  }

  // Mevcut kullanıcıyı filtrele
  const otherUsers = users.filter(user => user.email !== session?.user?.email)

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yükleniyor...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                EduPlatform
              </Link>
            </div>
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Messages Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Mesajlaşma
          </h1>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex h-96">
              {/* Users List */}
              <div className="w-1/3 border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Kullanıcılar
                  </h2>
                </div>
                <div className="overflow-y-auto h-80">
                  {otherUsers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Başka kullanıcı bulunamadı
                    </div>
                  ) : (
                    otherUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => selectUser(user)}
                        className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                          selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                              {user.avatar ? (
                                <img 
                                  src={user.avatar} 
                                  alt={user.name} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm text-white font-bold">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col">
                {selectedUser ? (
                  <>
                    {/* Messages Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                          {selectedUser.avatar ? (
                            <img 
                              src={selectedUser.avatar} 
                              alt={selectedUser.name} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm text-white font-bold">
                              {selectedUser.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {selectedUser.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          Henüz mesaj bulunmuyor. İlk mesajı gönderebilirsiniz!
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender.email === session.user?.email
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender.email === session.user?.email
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender.email === session.user?.email
                                    ? 'text-blue-100'
                                    : 'text-gray-500'
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleString('tr-TR')}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                      {error && (
                        <div className="mb-2 text-sm text-red-600">
                          {error}
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          placeholder="Mesajınızı yazın..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={isSending}
                        />
                        <button
                          type="submit"
                          disabled={isSending || !messageContent.trim()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isSending ? 'Gönderiliyor...' : 'Gönder'}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-lg mb-2">💬</p>
                      <p>Mesaj göndermek için bir kullanıcı seçin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 