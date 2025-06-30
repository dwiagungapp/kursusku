import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import api from '../lib/api' // pastikan kamu punya file api.ts yang sudah set token

type User = {
  name: string
  email: string
  role: 'admin' | 'student' // atau string sesuai backend-mu
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await api.get('/user/profile')
        setUser(res.data)
      } catch (err) {
        console.error('Gagal ambil profil user', err)
        localStorage.removeItem('token') // token tidak valid
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (token: string) => {
    localStorage.setItem('token', token)
    try {
      const res = await api.get('/user/profile')
      setUser(res.data)
    } catch (err) {
      console.error('Gagal ambil data user setelah login', err)
    }
  }

 const logout = () => {
  localStorage.removeItem('token')
  setUser(null)
  // ❌ jangan panggil navigate() di sini
}

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider")
  }
  return context
}
