import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Course from '../pages/Course'
import Module from '../pages/Module'
import Quiz from '../pages/Quiz'
import Profile from '../pages/Profile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CourseList from '../pages/CourseList'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AdminLayout from '../layouts/AdminLayout'
import AddCourse from '../pages/admin/AddCourse'
import AddModule from '../pages/admin/AddModule'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AddQuiz from '../pages/admin/AddQuiz'
import AdminModuleList from '../pages/admin/AdminModuleList'
import AdminCourseList from '../pages/admin/AdminCourseList'
import AdminRoute from './AdminRoute'
import EditCourse from '../pages/admin/EditCourse'
import EditModule from '../pages/admin/EditModule'
import QuizResult from '../pages/QuizResult'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Student Area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/course/module/:id" element={<Module />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz/:id/result" element={<QuizResult/>} />
        </Route>

        {/* Admin Area */}
        <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="/admin/course/add" element={<AddCourse />} />
          <Route path="/admin/course/list" element={<AdminCourseList />} />
          <Route path="/admin/module/add" element={<AddModule />} />
          <Route path="/admin/module/list" element={<AdminModuleList />} />
          <Route path="/admin/module/:moduleId/quiz/add" element={<AddQuiz />} />
          <Route path="/admin/course/edit/:id" element={<EditCourse />} />
          <Route path="/admin/module/edit/:id" element={<EditModule />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
