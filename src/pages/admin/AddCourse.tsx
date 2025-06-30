import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import Swal from 'sweetalert2'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

export default function AddCourse() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [teacher, setTeacher] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const navigate = useNavigate()

  const { quill, quillRef } = useQuill()

  // Sinkronisasi isi editor ke state `description`
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setDescription(quill.root.innerHTML)
      })
    }
  }, [quill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/courses', {
        title,
        description,
        teacher,
        image_url: imageUrl,
      })

      await Swal.fire({
        title: 'Berhasil!',
        text: 'Kursus berhasil ditambah.',
        icon: 'success',
        confirmButtonText: 'OK',
      })

      navigate('/admin/course/list')
    } catch (err) {
      console.error('Gagal menambah kursus', err)
      Swal.fire('Error', 'Gagal menambah data kursus', 'error')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Tambah Kursus</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="URL Gambar (opsional)"
          className="w-full border px-3 py-2 rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Judul"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Guru/Pengajar"
          className="w-full border px-3 py-2 rounded"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi Kursus</label>
          <div className="bg-white border border-gray-200 rounded overflow-hidden min-h-[200px]">
            <div ref={quillRef} />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full font-semibold"
        >
          Tambah
        </button>
      </form>
    </div>
  )
}
