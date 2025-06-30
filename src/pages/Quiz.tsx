import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import BottomNav from '../components/layout/BottomNav'
import { toast } from 'react-hot-toast'

export default function Quiz() {
  const { id } = useParams()
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const navigate = useNavigate()

  useEffect(() => {
  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/modules/${id}/quiz`)
      setQuestions(res.data)
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.message || 'Gagal mengambil soal kuis')
        navigate(`/course/module/${id}`)
      } else {
        toast.error('Gagal mengambil soal kuis')
      }
    } finally {
      setLoading(false)
    }
  }

  fetchQuiz()
}, [id])

  const handleSelect = (quizId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [quizId]: optionId }))
  }

  const handleSubmit = async () => {
  try {
    const payload = {
      module_id: Number(id),
      answers,
    }
    const res = await api.post('/quiz/submit', payload)

    // ✅ Tandai selesai setelah submit
    await api.post(`/modules/${id}/complete`)

    toast.success(`Skor kamu: ${res.data.score} ✅`, {
      icon: '🏆',
      duration: 4000
    })
    navigate(`/course/module/${id}`)
  } catch (err) {
    toast.error('Gagal submit kuis')
    console.error(err)
  }
}


  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 space-y-4 animate-pulse">
        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-5 w-2/3 bg-gray-300 rounded"></div>
        <div className="space-y-3 mt-6">
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!questions.length) {
    return <p className="p-4 text-gray-500">Belum ada soal untuk modul ini.</p>
  }

  const current = questions[currentIndex]

  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="py-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">🧠 Kuis</h2>
        <p className="text-sm text-gray-500">Soal {currentIndex + 1} dari {questions.length}</p>
      </div>

      <h1 className="text-lg font-semibold mb-4">{current.question}</h1>

      <div className="space-y-3">
        {current.options.map((opt: any, i: number) => (
          <button
            key={i}
            onClick={() => handleSelect(current.id, opt.id)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition duration-150 ${
              answers[current.id] === opt.id
                ? 'bg-blue-100 border-blue-500 text-blue-800 font-semibold'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {opt.option_text}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center gap-2">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="w-1/2 py-2 rounded-xl bg-gray-200 text-gray-800 font-medium disabled:opacity-50"
        >
          ← Sebelumnya
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="w-1/2 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Selanjutnya →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-1/2 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700"
          >
            Selesai
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
