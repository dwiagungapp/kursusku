// src/layouts/AdminLayout.tsx
import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin/dashboard" className="block hover:underline">Dashboard</Link>
          <Link to="/admin/course/list" className="block hover:underline">Manajemen Kursus</Link>
          <Link to="/admin/module/list" className="block hover:underline">Manajemen Modul</Link>
          {/* <Link to="/admin/module/add" className="block hover:underline">Tambah Modul</Link> */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
