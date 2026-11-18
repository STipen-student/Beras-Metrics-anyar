import { FileText, Target, UploadCloud } from "lucide-react";

export default function CourseProfile() {
  return (
    <div className="animate-in fade-in space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold text-slate-800">Profil Mata Kuliah</h2>
        <p className="text-slate-500 mt-2">Pemodelan Matematika - S2 Pendidikan Matematika UNS</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <FileText size={20} /> Deskripsi Mata Kuliah
            </h3>
            <p className="text-slate-600 leading-relaxed text-justify">
              Mata kuliah Pemodelan Matematika membekali mahasiswa S2 dengan kemampuan untuk memformulasikan, menganalisis, 
              dan menyelesaikan permasalahan dunia nyata ke dalam bentuk matematika. Secara khusus, materi ini mengeksplorasi 
              fenomena ekonomi riil berupa laju perubahan harga beras di Pasar Tradisional Jebres, Surakarta, menggunakan persamaan diferensial.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <Target size={20} /> Capaian Pembelajaran (CPMK)
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Mampu memodelkan permasalahan ekonomi (penawaran dan permintaan) ke dalam persamaan diferensial dasar.</li>
              <li>Mampu menentukan dan menginterpretasikan koefisien sensitivitas pasar dari data empiris.</li>
              <li>Mampu menggunakan perangkat simulasi untuk memprediksi fluktuasi harga beras.</li>
              <li>Mampu memecahkan studi kasus dunia nyata dan memberikan argumen logis secara matematis.</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-100 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col justify-start items-center text-center h-full">
          <UploadCloud size={48} className="text-emerald-600 mb-4 mt-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Materi Penunjang & RPS</h3>
          <p className="text-slate-500 mb-6 text-sm max-w-sm">
            Berikut adalah file referensi yang diunggah untuk kelas.
          </p>
          
          <div className="space-y-4 w-full">
            <div className="w-full p-4 bg-white rounded-lg shadow-sm text-left border border-slate-200 transition hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                   <FileText size={16} className="text-emerald-500" />
                   <span className="text-sm font-medium">RPS Pemodelan Matematika</span>
                 </div>
                 <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Tersedia</span>
              </div>
              <a href="/RPS_Pemodelan.pdf" download="RPS_Pemodelan" className="text-emerald-600 font-semibold text-xs hover:underline flex mt-3 justify-end items-center gap-1">
                Unduh Dokumen &rarr;
              </a>
            </div>

            <div className="w-full p-4 bg-white rounded-lg shadow-sm text-left border border-slate-200 transition hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                   <FileText size={16} className="text-blue-500" />
                   <span className="text-sm font-medium">Modul Dasar PD Linear Orde 1</span>
                 </div>
                 <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Tersedia</span>
              </div>
              <a href="/Modul_Dasar_PD.pdf" download="Modul_Dasar_PD" className="text-blue-600 font-semibold text-xs hover:underline flex mt-3 justify-end items-center gap-1">
                Unduh Dokumen &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
