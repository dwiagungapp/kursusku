import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function AdminCourseList() {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses')
      setCourses(res.data)
    } catch (err) {
      console.error('Gagal mengambil kursus', err)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Hapus Kursus?',
      text: 'Kursus yang dihapus tidak bisa dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal'
    })

    if (!confirm.isConfirmed) return

    try {
      await api.delete(`/courses/${id}`)
      await Swal.fire('Berhasil', 'Kursus berhasil dihapus', 'success')
      fetchCourses()
    } catch (err) {
      console.error('Gagal menghapus kursus', err)
      Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus kursus', 'error')
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl">🎓 Manajemen Kursus</h1>
        <button
          onClick={() => navigate('/admin/course/add')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          + Tambah Kursus
        </button>
      </div>

      <div className="space-y-4">
        {courses.map((course: any) => (
          <div
            key={course.id}
            className="p-4 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg text-blue-800">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-3">👩‍🏫 Pengajar: {course.teacher}</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/admin/course/edit/${course.id}`)}
                className="px-3 py-1 bg-yellow-400 text-white text-sm rounded hover:bg-yellow-500"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
