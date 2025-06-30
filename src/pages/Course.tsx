import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import BottomNav from '../components/layout/BottomNav'

export default function Course() {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()
  const [completed, setCompleted] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCourse = await api.get(`/courses/${id}`)
        setCourse(resCourse.data)

        const resProgress = await api.get('/progress')
        setCompleted(resProgress.data.completed_module_ids || [])
      } catch (err) {
        console.error('Gagal mengambil data kursus atau progress', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return (
    <div className="min-h-screen pb-16 px-4 bg-gray-50">
      <div className="py-4 flex items-center space-x-2">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h2 className="font-semibold text-lg">Detail Kursus</h2>
      </div>

      {loading ? (
        <>
          <div className="animate-pulse bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mt-1"></div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-14 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
             <img src={course.image_url} className='mb-4' />
            <h1 className="text-xl font-bold">{course.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Pengajar: {course.teacher}</p>
            <div dangerouslySetInnerHTML={{ __html: course.description }} className='text-sm mt-2' />
          </div>

          <h3 className="text-base font-semibold mb-2">📖 Modul Materi</h3>
          <div className="space-y-2">
            {course.modules?.map((mod: any) => (
              <div
                key={mod.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer flex items-center justify-between hover:bg-gray-50"
                onClick={() => navigate(`/course/module/${mod.id}`)}
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{mod.title}</p>
                </div>
                {completed.includes(mod.id) && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    ✅
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}
