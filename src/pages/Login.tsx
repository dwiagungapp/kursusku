import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { AxiosError } from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()   // 🔑 gunakan context login()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token)           // ✅ ini yang penting!
      navigate('/')
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      alert('Login gagal: ' + (error.response?.data?.message || 'Terjadi kesalahan'))
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl">
          Masuk
        </button>
        <p className="text-sm text-center">
          Belum punya akun? <a href="/register" className="text-blue-600">Daftar</a>
        </p>
      </form>
    </div>
  )
}
