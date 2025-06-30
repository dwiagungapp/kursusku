import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import BottomNav from "../components/layout/BottomNav";
import toast from "react-hot-toast";

export default function Module() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasDoneQuiz, setHasDoneQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasQuiz, setHasQuiz] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, progressRes, historyRes, quizCheckRes] =
          await Promise.all([
            api.get(`/modules/${id}`),
            api.get("/progress"),
            api.get("/quiz/history"),
            api.get(`/modules/${id}/quiz/check`),
          ]);

        setModule(modRes.data);
        const completed = progressRes.data.completed_module_ids || [];
        setIsCompleted(completed.includes(Number(id)));

        const doneIds = historyRes.data.history.map(
          (item: any) => item.module.id
        );
        setHasDoneQuiz(doneIds.includes(Number(id)));
        setHasQuiz(quizCheckRes.data.available);
      } catch (err) {
        console.error("Gagal mengambil data modul", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleComplete = async () => {
    try {
      // ✅ 1. Tandai modul sebagai selesai terlebih dahulu
      await api.post(`/modules/${id}/complete`);
      setIsCompleted(true);

      // ✅ 2. Cek apakah modul memiliki kuis
      const res = await api.get(`/modules/${id}/quiz/check`);
      const hasQuiz = res.data.available;

      // ✅ 3. Jika ada kuis dan belum dikerjakan, arahkan ke halaman kuis
      if (hasQuiz && !hasDoneQuiz) {
        navigate(`/quiz/${id}`);
      } else {
        toast.success("Materi selesai ✅");
      }
    } catch (err) {
      console.error("Gagal menyelesaikan modul atau memuat kuis", err);
      toast.error("Gagal memproses aksi");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 pt-6 pb-20 animate-pulse space-y-4">
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-6 w-3/4 bg-gray-300 rounded" />
        <div className="aspect-video bg-gray-200 rounded-xl" />
        <div className="h-32 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!module) return <p className="p-4 text-red-600">Modul tidak ditemukan</p>;

  return (
    <div className="min-h-screen pb-16 px-4">
      {/* Header */}
      <div className="py-4 flex items-center space-x-2">
        <button
          onClick={() => navigate(`/course/${module.course_id}`)}
          className="text-xl"
        >
          ←
        </button>
        <h2 className="font-semibold text-lg">Materi</h2>
      </div>

      <h1 className="text-xl font-bold mb-2">{module.title}</h1>

      {module.video_url && (
        <div className="w-full aspect-video mb-4 rounded-xl overflow-hidden shadow-sm">
          <iframe
            className="w-full h-full"
            src={module.video_url}
            title="Video Materi"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div
        className="text-sm bg-white p-4 rounded-xl shadow-sm prose max-w-none prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded"
        dangerouslySetInnerHTML={{ __html: module.content }}
      ></div>

      {!isCompleted && (
        <div className="mt-6">
          <button
            className="w-full py-2 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700"
            onClick={handleComplete}
          >
            ✅ Tandai Selesai
          </button>
        </div>
      )}

      {isCompleted && hasQuiz && (
        <div className="mt-4">
          {!hasDoneQuiz ? (
            <button
              className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
              onClick={() => navigate(`/quiz/${id}`)}
            >
              ▶️ Lanjut Kerjakan Kuis
            </button>
          ) : (
            <button
              className="w-full py-2 rounded-xl bg-purple-600 text-white font-semibold shadow hover:bg-purple-700"
              onClick={() => navigate(`/quiz/${id}/result`)}
            >
              📊 Lihat Hasil Kuis
            </button>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
