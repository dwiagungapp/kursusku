import { useEffect, useState } from 'react'
import api from '../lib/api'
import BottomNav from '../components/layout/BottomNav'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Swal from 'sweetalert2'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [lastScore, setLastScore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/quiz/history'),
        ])
        setProfile(profileRes.data)
        const history = historyRes.data.history
        if (history.length > 0) setLastScore(history[0])
      } catch (err) {
        console.error('Gagal memuat data profil/kuis', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Yakin ingin logout?',
      text: 'Kamu akan keluar dari aplikasi',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Ya, logout',
      cancelButtonText: 'Batal',
    })

    if (!result.isConfirmed) return

    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.warn('Gagal logout API')
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="bg-blue-600 text-white px-6 py-6 rounded-b-3xl shadow-md text-center">
        <h1 className="text-xl font-bold">👤 Profil Pengguna</h1>
        {loading ? (
          <div className="mt-4 animate-pulse space-y-2">
            <div className="h-4 w-1/2 bg-blue-300 mx-auto rounded" />
            <div className="h-3 w-1/3 bg-blue-200 mx-auto rounded" />
          </div>
        ) : (
          <>
            <p className="mt-2 text-lg font-semibold">{profile?.name}</p>
            <p className="text-sm">{profile?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-block mt-1 text-xs bg-white text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                🛠 Admin
              </span>
            )}
          </>
        )}
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Skor Terakhir */}
        {loading ? (
          <div className="bg-white p-5 rounded-xl shadow animate-pulse space-y-3">
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="h-3 w-1/3 bg-gray-100 rounded" />
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
        ) : lastScore ? (
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-base font-semibold text-gray-800 mb-2">🧠 Kuis Terakhir</h3>
            <p className="text-sm text-gray-700">
              Modul: <b>{lastScore.module?.title}</b>
            </p>
            <p className="text-sm text-gray-700">
              Kursus: <b>{lastScore.course?.title ?? 'Tidak tersedia'}</b>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Dikerjakan: {new Date(lastScore.submitted_at).toLocaleString('id-ID')}
            </p>
            <p className="text-2xl font-bold text-green-600 mt-3">Skor: {lastScore.score}</p>
          </div>
        ) : null}

        {/* Admin Dashboard Button */}
        {!loading && user?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            🔧 Admin Dashboard
          </button>
        )}

        {/* Logout Button */}
        {!loading && (
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
          >
            🔓 Logout
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
