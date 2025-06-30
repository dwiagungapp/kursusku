import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import BottomNav from '../components/layout/BottomNav'

export default function CourseList() {
  const [courses, setCourses] = useState<any[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses')
        setCourses(res.data)
        setFilteredCourses(res.data)
      } catch (err) {
        console.error('Gagal mengambil kursus', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleSearch = () => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchInput.toLowerCase())
    )
    setFilteredCourses(filtered)
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 bg-gray-50">
      <h1 className="text-lg font-bold mb-4">Semua Kursus</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Cari judul kursus..."
          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-blue-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700"
        >
          🔍 Cari
        </button>
      </div>

      {/* Skeleton Loading */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 bg-white border border-gray-200 p-3 rounded-xl animate-pulse"
            >
              <div className="w-24 h-20 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                <div className="w-1/2 h-3 bg-gray-100 rounded" />
                <div className="w-1/3 h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <p className="text-sm text-gray-500">Kursus tidak ditemukan.</p>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className="bg-white rounded-xl shadow hover:shadow-md border border-gray-200 transition p-3 flex gap-4 cursor-pointer"
            >
              {/* Gambar thumbnail */}
              <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={course.image_url || 'https://placehold.co/100x100?text=No+Image'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info kursus */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-blue-600 mt-1">👩‍🏫 {course.teacher}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  📘 {course.modules_count || 0} Materi
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  )
}