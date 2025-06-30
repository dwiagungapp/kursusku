import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

export default function AddModule() {
  const [courses, setCourses] = useState<any[]>([])
  const [courseId, setCourseId] = useState('')
  const [title, setTitle] = useState('')
  const [video_url, setVideoUrl] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const { quill, quillRef } = useQuill()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses')
        setCourses(res.data)
      } catch (err) {
        console.error('Gagal ambil daftar kursus', err)
      }
    }

    fetchCourses()
  }, [])

  // Bind konten editor ke state
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setContent(quill.root.innerHTML)
      })
    }
  }, [quill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId) return alert('Pilih kursus terlebih dahulu.')
    setLoading(true)

    try {
      await api.post(`/courses/${courseId}/modules`, {
        title,
        content,
        video_url,
      })

      setSuccess(true)
      setTitle('')
      setVideoUrl('')
      setContent('')
      if (quill) quill.setText('') // Kosongkan editor
      setTimeout(() => navigate(`/admin/module/list`), 1500)
    } catch (err) {
      console.error('Gagal menambahkan modul', err)
      alert('Gagal menambahkan modul')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <h1 className="text-xl font-bold mb-4">📝 Tambah Modul Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Pilih Kursus</label>
          <select
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-2"
          >
            <option value="">-- Pilih Kursus --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Judul Modul</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-2"
            placeholder="Contoh: Pengenalan HTML"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Url Video</label>
          <input
            type="text"
            value={video_url}
            onChange={e => setVideoUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-2"
            placeholder="Url Video Embed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Isi Modul</label>
          <div className="bg-white overflow-hidden min-h-[200px]">
            <div ref={quillRef} />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Tambah Modul'}
        </button>

        {success && (
          <p className="text-green-600 text-sm text-center mt-2">
            ✅ Modul berhasil ditambahkan!
          </p>
        )}
      </form>
    </div>
  )
}
