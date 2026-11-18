import { BookOpen } from "lucide-react";

export default function CoreMaterial() {
  return (
    <div className="animate-in fade-in space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold text-slate-800">Materi Pokok</h2>
        <p className="text-slate-500 mt-2">Pemodelan Matematika Laju Perubahan Harga Beras</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-slate-700">
        <div className="p-8 md:p-10 space-y-6">
          <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 border-l-4 border-l-emerald-500">
            <BookOpen className="shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">Persamaan Diferensial Dasar</h3>
              <p className="text-emerald-800">
                Pemodelan harga di pasar tradisional dapat didekati melalui hukum keseimbangan penawaran dan permintaan (Supply and Demand).
              </p>
            </div>
          </div>

          <p className="leading-relaxed text-lg">
            Anggap <strong className="font-semibold text-slate-900">P(t)</strong> adalah harga beras pada waktu <em>t</em>.
            Perubahan harga suatu barang sangat bergantung pada selisih antara Kuantitas Kebutuhan / Permintaan (<strong className="font-semibold text-slate-900">Qd</strong> - Demand) 
            dan Kuantitas Stok / Penawaran yang Tersedia (<strong className="font-semibold text-slate-900">Qs</strong> - Supply).
          </p>

          <div className="bg-slate-50 py-8 rounded-xl flex justify-center border border-slate-200">
             <div className="text-2xl md:text-4xl font-mono text-emerald-700 font-bold tracking-widest">
               dP/dt = k(Qd - Qs)
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
             <div className="space-y-4">
               <h4 className="font-bold text-lg text-slate-800">Definisi Variabel</h4>
               <ul className="space-y-3">
                 <li className="flex gap-3">
                   <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold font-mono text-slate-700 shrink-0">P</div>
                   <p className="text-sm pt-1">Harga beras pada waktu tertentu.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold font-mono text-slate-700 shrink-0">Qd</div>
                   <p className="text-sm pt-1">Kuantitas permintaan beras di Pasar Jebres.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold font-mono text-slate-700 shrink-0">Qs</div>
                   <p className="text-sm pt-1">Kuantitas stok/penawaran beras yang ada di pasar.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono shrink-0">k</div>
                   <p className="text-sm pt-1"><strong className="text-slate-800">Koefisien Sensitivitas Pasar</strong>. Nilai ini menunjukkan seberapa cepat pasar menaikkan/menurunkan harga untuk setiap unit selisih permintaan dan penawaran.</p>
                 </li>
               </ul>
             </div>

             <div className="space-y-4">
               <h4 className="font-bold text-lg text-slate-800">Interpretasi Model</h4>
               <div className="space-y-3">
                  <div className="bg-white border rounded-lg p-3 shadow-sm border-l-4 border-l-red-500">
                    <p className="font-bold text-sm text-slate-800">Jika Qd &gt; Qs (Kelangkaan):</p>
                    <p className="text-xs text-slate-500 mt-1">Maka dP/dt &gt; 0, artinya harga beras akan <strong className="text-red-600">naik</strong> seiring waktu.</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3 shadow-sm border-l-4 border-l-blue-500">
                    <p className="font-bold text-sm text-slate-800">Jika Qd &lt; Qs (Surplus):</p>
                    <p className="text-xs text-slate-500 mt-1">Maka dP/dt &lt; 0, artinya harga beras akan <strong className="text-blue-600">turun</strong> seiring waktu.</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3 shadow-sm border-l-4 border-l-emerald-500">
                    <p className="font-bold text-sm text-slate-800">Jika Qd = Qs (Keseimbangan):</p>
                    <p className="text-xs text-slate-500 mt-1">Maka dP/dt = 0, artinya harga beras <strong className="text-emerald-600">stabil</strong>.</p>
                  </div>
               </div>
             </div>
          </div>
          
          <div className="pt-6 border-t mt-8">
             <h4 className="font-bold text-slate-800 mb-2">Penyelesaian Analitik</h4>
             <p className="text-slate-600 mb-4">Jika diasumsikan nilai Qd dan Qs tetap dalam interval waktu tertentu, maka integrasi persamaan diferensial di atas terhadap waktu <em>t</em> menghasilkan fungsi linear:</p>
             <div className="bg-slate-800 text-emerald-400 p-4 rounded-xl font-mono text-center mb-4">
               P(t) = P(0) + k(Qd - Qs)t
             </div>
             <p className="text-slate-600 text-sm italic text-center">Di mana P(0) adalah harga awal beras (saat t = 0).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
