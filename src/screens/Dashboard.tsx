import { ArrowRight, TrendingUp } from "lucide-react";

export default function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-emerald-700 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Selamat Datang,</h2>
          <h3 className="text-xl md:text-3xl font-medium text-emerald-100 mb-6">
            Mahasiswa S2 Pendidikan Matematika UNS.
          </h3>
          <p className="text-emerald-50 max-w-2xl text-lg leading-relaxed mb-8">
            BerasMetrics merupakan media pembelajaran interaktif yang dirancang khusus untuk membedah studi kasus nyata: 
            <strong className="font-semibold text-white"> Laju Perubahan Harga Beras di Pasar Tradisional Jebres, Surakarta.</strong>
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab("material")}
              className="bg-white text-emerald-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Mulai Belajar Teori <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setActiveTab("simulation")}
              className="bg-emerald-600 border border-emerald-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-500 transition-colors shadow-sm"
            >
              Simulasi Grafik <TrendingUp size={18} />
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-600 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-20 -mb-20 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mt-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-slate-800">Pahami Konsep</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pelajari model matematika dP/dt = k(Qd - Qs) dan bagaimana koefisiennya berlaku dalam dunia nyata.
            </p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-slate-800">Simulasi Interaktif</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Gunakan kalkulator dan grafik langsung untuk melihat dampak perubahan pasokan dan permintaan terhadap harga.
            </p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-slate-800">Evaluasi AI</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Uji pemahaman Anda melalui studi kasus yang dinilai langsung oleh AI dengan feedback real-time.
            </p>
         </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Profil Pengembang</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 border border-slate-100 p-4 rounded-xl bg-slate-50">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
              N
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Nurul Huda Satriyanto</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">NIM: S852508014</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border border-slate-100 p-4 rounded-xl bg-slate-50">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
              R
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Ririn Mardiyanti</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">NIM: S852508015</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border border-slate-100 p-4 rounded-xl bg-slate-50 md:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl shrink-0 overflow-hidden border-2 border-white shadow-sm">
              <img 
                src="/foto_dr_rubono.jpg" 
                alt="Dr. Rubono Setiawan" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.src = 'https://api.dicebear.com/9.x/micah/svg?seed=DrRubonoSetiawan&backgroundColor=d1fae5' }}
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Dr. Rubono Setiawan, S.Si., M.Sc.</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">NIP: 198509252010121005</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
