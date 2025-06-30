import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, User } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-t-gray-200 shadow-md flex justify-around py-2 z-50">
      <Link to="/" className="flex flex-col items-center">
        <Home size={20} className={isActive('/') ? 'text-blue-600' : 'text-gray-400'} />
        <span className={`text-xs ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>Home</span>
      </Link>
      <Link to="/courses" className="flex flex-col items-center">
        <BookOpen size={20} className={isActive('/courses') ? 'text-blue-600' : 'text-gray-400'} />
        <span className={`text-xs ${isActive('/courses') ? 'text-blue-600' : 'text-gray-400'}`}>Course</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center">
        <User size={20} className={isActive('/profile') ? 'text-blue-600' : 'text-gray-400'} />
        <span className={`text-xs ${isActive('/profile') ? 'text-blue-600' : 'text-gray-400'}`}>Profile</span>
      </Link>
    </nav>
  )
}