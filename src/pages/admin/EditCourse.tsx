import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../lib/api'
import Swal from 'sweetalert2'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

export default function EditCourse() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState({
    title: '',
    teacher: '',
    description: '',
    image_url: ''
  })

  const { quill, quillRef } = useQuill()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`)
        setCourse(res.data)
        // Set konten editor dari deskripsi saat pertama kali load
        if (quill) {
          quill.root.innerHTML = res.data.description || ''
        }
      } catch (err) {
        console.error('Gagal memuat data kursus', err)
        Swal.fire('Error', 'Gagal memuat data kursus', 'error')
      }
    }

    fetchCourse()
  }, [id, quill])

  // Sinkronisasi perubahan Quill ke state
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setCourse(prev => ({ ...prev, description: quill.root.innerHTML }))
      })
    }
  }, [quill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`/courses/${id}`, course)
      await Swal.fire({
        title: 'Berhasil!',
        text: 'Kursus berhasil diperbarui.',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      navigate('/admin/course/list')
    } catch (err) {
      console.error('Gagal memperbarui kursus', err)
      Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui kursus', 'error')
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-lg font-bold mb-4">Edit Kursus</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={course.image_url}
          onChange={e => setCourse({ ...course, image_url: e.target.value })}
          placeholder="URL Gambar (opsional)"
          className="w-full p-2 border rounded"
        />
        <input
          value={course.title}
          onChange={e => setCourse({ ...course, title: e.target.value })}
          placeholder="Judul Kursus"
          className="w-full p-2 border rounded"
        />
        <input
          value={course.teacher}
          onChange={e => setCourse({ ...course, teacher: e.target.value })}
          placeholder="Nama Pengajar"
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi Kursus</label>
          <div className="bg-white border border-gray-200 rounded min-h-[200px] overflow-hidden">
            <div ref={quillRef} />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold">
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}
