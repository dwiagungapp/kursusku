import { useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../lib/api'

type QuestionType = {
  question: string
  options: string[]
  correct_index: number
}

export default function AddQuiz() {
  const { moduleId } = useParams()
  const [questions, setQuestions] = useState<QuestionType[]>([
    { question: '', options: ['', ''], correct_index: 0 }
  ])
  const [showPreview, setShowPreview] = useState(false)

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', ''], correct_index: 0 }])
  }

  const removeQuestion = (index: number) => {
    if (!confirm('Yakin ingin menghapus pertanyaan ini?')) return
    const updated = [...questions]
    updated.splice(index, 1)
    setQuestions(updated)
  }

  const updateQuestionField = (
    index: number,
    field: keyof QuestionType,
    value: string | number
  ) => {
    const newQuestions = [...questions]
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    }
    setQuestions(newQuestions)
  }

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options[optIndex] = value
    setQuestions(newQuestions)
  }

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options.push('')
    setQuestions(newQuestions)
  }

  const removeOption = (qIndex: number, optIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options.splice(optIndex, 1)
    if (newQuestions[qIndex].correct_index >= newQuestions[qIndex].options.length) {
      newQuestions[qIndex].correct_index = 0
    }
    setQuestions(newQuestions)
  }

  const validateQuestions = (): boolean => {
    for (const q of questions) {
      if (!q.question.trim()) return false
      if (q.options.length < 2) return false
      if (q.options.some(opt => !opt.trim())) return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateQuestions()) {
      alert('Pastikan semua pertanyaan dan opsi terisi dengan benar!')
      return
    }

    try {
      for (const q of questions) {
        await api.post(`/modules/${moduleId}/quiz`, {
          question: q.question,
          options: q.options,
          correct_index: q.correct_index
        })
      }
      alert('Kuis berhasil ditambahkan')
    } catch (err) {
      console.error('Gagal menambahkan kuis', err)
    }
  }

  return (
    <div className="p-4">
      <h1 className="font-bold text-lg mb-4">Tambah Kuis</h1>
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="space-y-2 border p-4 rounded-md bg-white shadow-sm relative">
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-2 right-2 text-red-500 text-sm"
            >
              🗑️
            </button>
            <input
              value={q.question}
              onChange={e => updateQuestionField(qIndex, 'question', e.target.value)}
              placeholder={`Pertanyaan ${qIndex + 1}`}
              className="w-full p-2 border rounded"
            />
            {q.options.map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  value={opt}
                  onChange={e => updateOption(qIndex, i, e.target.value)}
                  placeholder={`Opsi ${i + 1}`}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="radio"
                  checked={q.correct_index === i}
                  onChange={() => updateQuestionField(qIndex, 'correct_index', i)}
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(qIndex, i)}
                    className="text-xs text-red-500"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qIndex)}
              className="text-sm text-blue-600"
            >
              + Tambah Opsi
            </button>
          </div>
        ))}

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={addQuestion}
            className="flex-1 py-2 rounded bg-yellow-400 text-white font-medium"
          >
            + Pertanyaan Baru
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex-1 py-2 rounded bg-gray-700 text-white font-medium"
          >
            🔍 Preview
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-2 rounded bg-blue-600 text-white font-semibold"
          >
            Simpan Semua
          </button>
        </div>
      </form>

      {/* Preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-bold mb-4">📝 Preview Soal</h2>
            <ol className="space-y-4 list-decimal ml-4">
              {questions.map((q, idx) => (
                <li key={idx}>
                  <p className="font-medium">{q.question}</p>
                  <ul className="ml-4 mt-1 list-disc text-sm">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={
                          i === q.correct_index ? 'text-green-600 font-semibold' : ''
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <div className="text-right mt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
