import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import Swal from 'sweetalert2'

export default function AdminModuleList() {
  const [modules, setModules] = useState<any[]>([])
  const navigate = useNavigate()

  const fetchModules = async () => {
    try {
      const res = await api.get('/admin/modules')
      setModules(res.data)
    } catch (err) {
      console.error('Gagal mengambil modul', err)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [])

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Hapus Modul?',
      text: 'Semua kuis dan data terkait modul ini juga akan dihapus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal'
    })

    if (!confirm.isConfirmed) return

    try {
      await api.delete(`/modules/${id}`)
      Swal.fire('Berhasil', 'Modul berhasil dihapus', 'success')
      setModules(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Gagal menghapus modul', err)
      Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus modul', 'error')
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-800">🗂️ Manajemen Modul</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl font-medium"
          onClick={() => navigate('/admin/module/add')}
        >
          + Tambah Modul
        </button>
      </div>

      <div className="grid gap-4">
        {modules.map(mod => (
          <div
            key={mod.id}
            className="p-4 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">{mod.title}</p>
                <p className="text-sm text-gray-500">📚 Course ID: {mod.course_id}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/module/edit/${mod.id}`}
                  className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-3 py-1 text-sm rounded"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(mod.id)}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 text-sm rounded"
                >
                  🗑️ Hapus
                </button>
                <Link
                  to={`/admin/module/${mod.id}/quiz/add`}
                  className="bg-blue-500 hover:bg-blue-600 transition text-white px-3 py-1 text-sm rounded"
                >
                  ➕ Kuis
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
