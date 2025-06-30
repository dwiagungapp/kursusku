import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { AxiosError } from 'axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: confirm,
      })
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
         const error = err as AxiosError<{ message?: string }>
  alert('Gagal daftar: ' + (error.response?.data?.message || 'Terjadi kesalahan'))
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6">Daftar Akun</h1>
      <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />
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
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl"
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-xl">
          Daftar
        </button>
        <p className="text-sm text-center">
          Sudah punya akun? <a href="/login" className="text-blue-600">Masuk</a>
        </p>
      </form>
    </div>
  )
}