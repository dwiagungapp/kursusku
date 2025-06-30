import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../lib/api'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

export default function EditModule() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [module, setModule] = useState({
    title: '',
    content: '',
    video_url: ''
  })

  const { quill, quillRef } = useQuill()

  // Fetch modul
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.get(`/modules/${id}`)
        setModule(res.data)
        setTimeout(() => {
          if (quill) {
            quill.clipboard.dangerouslyPasteHTML(res.data.content || '')
          }
        }, 0)
      } catch (err) {
        console.error('Gagal memuat modul', err)
      }
    }

    fetchModule()
  }, [id, quill])

  // Ambil isi content dari editor setiap perubahan
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setModule(prev => ({
          ...prev,
          content: quill.root.innerHTML
        }))
      })
    }
  }, [quill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`/modules/${id}`, module)
      alert('✅ Modul berhasil diperbarui')
      navigate('/admin/module/list')
    } catch (err) {
      console.error('Gagal memperbarui modul', err)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-lg font-bold mb-4">✏️ Edit Modul</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={module.title}
          onChange={e => setModule({ ...module, title: e.target.value })}
          placeholder="Judul Modul"
          className="w-full p-2 border rounded"
        />
        <input
          value={module.video_url}
          onChange={e => setModule({ ...module, video_url: e.target.value })}
          placeholder="URL Video"
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Konten Materi</label>
          <div className="bg-white border rounded overflow-hidden min-h-[200px]">
            <div ref={quillRef} />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          💾 Simpan Perubahan
        </button>
      </form>
    </div>
  )
}
