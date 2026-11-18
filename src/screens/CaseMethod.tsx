import { useState } from "react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Sparkles, CheckCircle2, XCircle } from "lucide-react";

export default function CaseMethod() {
  const [problem, setProblem] = useState("");
  const [loadingProblem, setLoadingProblem] = useState(false);
  
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{score: number, feedback: string} | null>(null);

  const generateProblem = async () => {
    setLoadingProblem(true);
    setProblem("");
    setAnswer("");
    setEvaluation(null);
    try {
      const res = await fetch("/api/generate-case", { method: "POST" });
      const data = await res.json();
      if (res.status === 429) {
        alert(data.error || "Quota limit reached. Please wait a minute.");
      } else if (res.status === 503) {
        alert(data.error || "Sistem sedang sibuk. Silakan coba lagi nanti.");
      } else if (data.caseProblem) {
        setProblem(data.caseProblem);
      } else {
        alert("Gagal menghasilkan soal.");
      }
    } catch (e) {
      console.error(e);
      alert("Error generate problem");
    } finally {
      setLoadingProblem(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!answer.trim()) return;
    setIsEvaluating(true);
    setEvaluation(null);
    try {
      const res = await fetch("/api/evaluate-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, answer }),
      });
      const data = await res.json();
      if (res.status === 429) {
        alert(data.error || "Quota limit reached. Please wait a minute.");
      } else if (res.status === 503) {
        alert(data.error || "Sistem sedang sibuk. Silakan coba lagi nanti.");
      } else if (data.score !== undefined) {
        setEvaluation(data);
      } else {
        alert("Gagal mengevaluasi.");
      }
    } catch (e) {
      console.error(e);
      alert("Error evaluate answer");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="animate-in fade-in space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold text-slate-800">Case Method & Evaluasi AI</h2>
        <p className="text-slate-500 mt-2">Uji pemahaman Anda pada studi kasus dunia nyata dengan penilaian real-time.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-emerald-100 bg-emerald-50/50 flex justify-between items-center">
           <h3 className="text-lg font-bold text-emerald-900">Studi Kasus Laju Harga Beras</h3>
           <button 
             onClick={generateProblem}
             disabled={loadingProblem}
             className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-70"
           >
             <Sparkles size={16} /> 
             {loadingProblem ? "Menyusun Kasus..." : "Generate Soal AI"}
           </button>
        </div>
        
        <div className="p-6 min-h-[200px]">
          {!problem && !loadingProblem && (
             <div className="text-center text-slate-400 py-12">
                <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                <p>Klik tombol "Generate Soal AI" untuk membuat studi kasus unik untuk sesi Anda.</p>
             </div>
          )}

          {loadingProblem && (
            <div className="flex justify-center items-center py-12">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {problem && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 markdown-body prose prose-emerald max-w-none text-slate-700">
                <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{problem}</Markdown>
              </div>

              <div className="space-y-3">
                 <label className="block font-bold text-slate-800">Jawaban & Langkah Penyelesaian:</label>
                 <textarea
                   className="w-full h-40 border border-slate-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm resize-y"
                   placeholder="Ketikkan langkah-langkah matematis Anda di sini..."
                   value={answer}
                   onChange={(e) => setAnswer(e.target.value)}
                 />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={evaluateAnswer}
                  disabled={isEvaluating || !answer.trim()}
                  className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition disabled:opacity-50"
                >
                  {isEvaluating ? "Mengevaluasi..." : "Kirim & Evaluasi Jawaban"}
                </button>
              </div>

              {evaluation && (
                 <div className="animate-in slide-in-from-bottom-2 fade-in mt-6">
                   <div className={`p-6 rounded-xl border ${evaluation.score >= 70 ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
                     <div className="flex items-start gap-4">
                       {evaluation.score >= 70 ? (
                         <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={32} />
                       ) : (
                         <XCircle className="text-orange-500 shrink-0 mt-1" size={32} />
                       )}
                       <div>
                         <div className="flex items-baseline gap-3 mb-2">
                            <h4 className="font-bold text-lg text-slate-800">Hasil Evaluasi AI</h4>
                            <span className={`font-mono text-2xl font-bold ${evaluation.score >= 70 ? 'text-emerald-600' : 'text-orange-600'}`}>
                              Nilai: {evaluation.score}/100
                            </span>
                         </div>
                         <div className="text-slate-700 leading-relaxed markdown-body prose prose-emerald max-w-none">
                           <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{evaluation.feedback}</Markdown>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
