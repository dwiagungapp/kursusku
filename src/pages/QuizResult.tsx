import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import BottomNav from "../components/layout/BottomNav";

export default function QuizResult() {
  const { id } = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/quiz/${id}/result`);
        setResult(res.data);
      } catch (err) {
        console.error("Gagal memuat hasil kuis", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (!result && !loading) {
    return (
      <p className="p-4 text-red-600 font-semibold">
        ⚠️ Hasil kuis tidak ditemukan
      </p>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 bg-gray-50">
      <div className="py-6 text-center">
        {loading ? (
          <>
            <div className="h-6 w-32 mx-auto bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-24 mx-auto bg-gray-100 rounded animate-pulse" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-700">Hasil Kuis</h2>
            <p className="text-sm text-gray-600 mt-1">
              Skor Anda:{" "}
              <span className="text-lg font-bold text-green-700">
                {result.score}
              </span>
            </p>
          </>
        )}
      </div>

      {(loading ? Array.from({ length: 2 }) : result.quizzes).map(
        (quiz: any, index: number) => (
          <div
            key={loading ? index : quiz.quiz_id}
            className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4"
          >
            {loading ? (
              <>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="font-medium mb-3 text-gray-800">
                  {index + 1}. {quiz.question}
                </p>

                <div className="space-y-2">
                  {quiz.options.map((opt: any) => {
                    const isSelected = opt.id === quiz.selected_option_id;
                    const isCorrect = opt.is_correct;

                    return (
                      <div
                        key={opt.id}
                        className={`
                        px-4 py-2 text-sm rounded-xl border transition flex items-center justify-between
                        ${
                          isCorrect
                            ? "border-green-500 bg-green-50 text-green-800 font-semibold"
                            : ""
                        }
                        ${
                          isSelected && !isCorrect
                            ? "border-red-400 bg-red-50 text-red-700"
                            : ""
                        }
                        ${
                          !isCorrect && !isSelected
                            ? "border-gray-300 text-gray-600"
                            : ""
                        }
                      `}
                      >
                        <span>{opt.text}</span>
                        <span>
                          {isCorrect
                            ? "✅"
                            : isSelected && !isCorrect
                            ? "❌"
                            : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <p
                    className={`text-sm font-medium ${
                      quiz.is_correct ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {quiz.is_correct
                      ? "✅ Jawaban Anda Benar"
                      : "❌ Jawaban Anda Salah"}
                  </p>
                </div>
              </>
            )}
          </div>
        )
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          ⬅️ Kembali ke Kursus
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
