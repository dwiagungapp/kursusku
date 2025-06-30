import { useEffect, useState } from 'react'
import api from '../lib/api'
import BottomNav from '../components/layout/BottomNav'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const [courses, setCourses] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, courseRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/courses'),
        ])
        setProfile(profileRes.data)
        setCourses(courseRes.data)
      } catch (err) {
        console.error('Gagal mengambil data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header & Greeting */}
      <div className="px-4 pt-6 space-y-2">
        <h1 className="text-lg font-bold">
          {loading ? (
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
          ) : (
            `Hi, ${profile?.name}`
          )}
        </h1>
        <p className="text-sm text-gray-500">
          {loading ? (
            <span className="inline-block w-40 h-4 bg-gray-100 rounded animate-pulse" />
          ) : (
            'Find your lessons today!'
          )}
        </p>
      </div>

      {/* Motivational Banner */}
      <div className="bg-blue-100 mx-4 mt-4 p-4 rounded-xl text-center text-sm shadow">
        <p className="text-gray-700 mb-2">
          We just don’t give our student only lecture but real life experience.
        </p>
        <div className="flex gap-2 justify-center">
          <Link
            to="/courses"
            className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
          >
            Explore Courses
          </Link>
        </div>
      </div>

      {/* Section Header */}
      <div className="mt-6 px-4 flex justify-between items-center">
        <h2 className="font-semibold text-base">Featured courses</h2>
        <Link to="/courses" className="text-sm text-blue-600 font-medium">
          See All
        </Link>
      </div>

      {/* Course List */}
      <div className="px-4 mt-3 space-y-3">
        {(loading ? Array.from({ length: 4 }) : courses).map((course: any, idx: number) => {
          const isLoading = loading
          return (
            <div
              key={course?.id || idx}
              onClick={() => !isLoading && course?.id && navigate(`/course/${course.id}`)}
              className={`bg-white border border-gray-100 rounded-xl shadow-sm flex gap-3 p-3 ${
                isLoading ? '' : 'cursor-pointer hover:shadow-md transition'
              }`}
            >
              {/* Gambar kiri */}
              <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {isLoading ? (
                  <div className="w-full h-full animate-pulse bg-gray-300" />
                ) : (
                  <img
                    src={course.image_url || 'https://placehold.co/100x100/png?text=Course'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Konten kanan */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="text-xs text-blue-500 font-semibold mb-1">
                    {isLoading ? (
                      <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      course.teacher
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">
                    {isLoading ? (
                      <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
                    ) : (
                      course.title
                    )}
                  </h4>
                </div>
                <div className="text-[11px] text-gray-500 mt-2">
                  {isLoading ? (
                    <div className="w-20 h-3 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    `📘 ${course.modules_count ?? 0} Materi`
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
