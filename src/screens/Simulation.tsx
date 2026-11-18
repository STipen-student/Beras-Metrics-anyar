import { useState, useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Calculator, Store } from "lucide-react";

export default function Simulation() {
  const [p0, setP0] = useState(12000);
  const [k, setK] = useState(100);
  const [tMax, setTMax] = useState(30);

  // 8 Toko data
  const [stores, setStores] = useState([
    { id: 1, name: "Toko A", price: 14000, qd: 1500, qs: 1100 },
    { id: 2, name: "Toko B", price: 14200, qd: 1450, qs: 1150 },
    { id: 3, name: "Toko C", price: 14400, qd: 1400, qs: 1200 },
    { id: 4, name: "Toko D", price: 14500, qd: 1350, qs: 1250 },
    { id: 5, name: "Toko E", price: 14600, qd: 1300, qs: 1300 },
    { id: 6, name: "Toko F", price: 14800, qd: 1250, qs: 1350 },
    { id: 7, name: "Toko G", price: 15000, qd: 1200, qs: 1400 },
    { id: 8, name: "Toko H", price: 15200, qd: 1100, qs: 1500 },
  ]);

  const updateStore = (id: number, field: string, value: number) => {
    setStores(stores.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const regression = useMemo(() => {
    const n = stores.length;
    let sumP = 0, sumQd = 0, sumQs = 0, sumP2 = 0, sumPQd = 0, sumPQs = 0;
    
    stores.forEach(s => {
      sumP += s.price;
      sumQd += s.qd;
      sumQs += s.qs;
      sumP2 += s.price * s.price;
      sumPQd += s.price * s.qd;
      sumPQs += s.price * s.qs;
    });

    const denom = (n * sumP2 - sumP * sumP);
    if (denom === 0) return { a: 0, b: 0, c: 0, d: 0 };

    const b = (n * sumPQd - sumP * sumQd) / denom;
    const a = (sumQd - b * sumP) / n;

    const d = (n * sumPQs - sumP * sumQs) / denom;
    const c = (sumQs - d * sumP) / n;

    return { a, b, c, d };
  }, [stores]);

  const { a, b, c, d } = regression;
  
  const [calcData, setCalcData] = useState({
    p1: 14000,
    t1: 0,
    p2: 15000,
    t2: 10,
  });

  const computedK = useMemo(() => {
    const { p1, t1, p2, t2 } = calcData;
    const dp = p2 - p1;
    const dt = t2 - t1;
    
    const meanP = (p1 + p2) / 2;
    const qdMean = a + b * meanP;
    const qsMean = c + d * meanP;
    const dq = qdMean - qsMean;
    
    if (dt === 0 || dq === 0) return null;
    
    const kValue = dp / (dt * dq);
    return kValue;
  }, [calcData, a, b, c, d]);

  // Membagi K dengan faktor tertentu jika terlalu besar untuk skala data, 
  // atau langsung menggunakannya. Karena harga ribuan, k=100 sangat besar.
  // Tapi kita ikuti input pengguna.
  const kReal = k / 1000; 
  
  // dP/dt = k(Qd - Qs) = k((a-c) + (b-d)P)
  // C1 = k(a-c), C2 = k(b-d)
  const c1 = kReal * (a - c);
  const c2 = kReal * (b - d);
  
  const pEq = c2 !== 0 ? -c1 / c2 : 0;

  const generateData = useMemo(() => {
    const data = [];
    for (let t = 0; t <= tMax; t++) {
      let p;
      if (c2 === 0) {
        p = p0 + c1 * t;
      } else {
        p = pEq + (p0 - pEq) * Math.exp(c2 * t);
      }
      data.push({
        time: t,
        price: Math.max(0, p),
      });
    }
    return data;
  }, [p0, kReal, a, b, c, d, tMax, pEq, c1, c2]);

  const formatNum = (num: number, digits=4) => {
    return num.toLocaleString('id-ID', { maximumFractionDigits: digits });
  }

  return (
    <div className="animate-in fade-in space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-3xl font-bold text-slate-800">Simulasi & Kalkulator</h2>
        <p className="text-slate-500 mt-2">Masukkan data dari 8 toko, hitung regresi linear permintaan & penawaran, dan simulasikan pergerakannya.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b bg-emerald-50">
          <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <Store size={24} /> 1. Input Data 8 Toko
          </h3>
          <p className="text-sm text-emerald-700">Data ini akan dicari fungsi liniernya (Qd = a + bP dan Qs = c + dP).</p>
        </div>
        
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="p-3">Toko</th>
                <th className="p-3">Harga Beras (P) - Rp</th>
                <th className="p-3">Permintaan (Qd)</th>
                <th className="p-3">Penawaran (Qs)</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-700">{s.name}</td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={s.price} 
                      onChange={(e) => updateStore(s.id, 'price', Number(e.target.value))}
                      className="w-full border p-2 rounded-lg" 
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={s.qd} 
                      onChange={(e) => updateStore(s.id, 'qd', Number(e.target.value))}
                      className="w-full border p-2 rounded-lg" 
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={s.qs} 
                      onChange={(e) => updateStore(s.id, 'qs', Number(e.target.value))}
                      className="w-full border p-2 rounded-lg" 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">2. Hasil Pemodelan & Simulasi Grafik</h3>
            <p className="text-sm text-slate-500 mt-1">Regresi Linier & Persamaan Diferensial (dP/dt)</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Model Matematika</p>
            <div className="font-mono text-sm text-slate-700 space-y-3">
              <div>
                <span className="text-slate-400">Regresi Permintaan:</span> <br/>
                Qd(P) = {formatNum(a)} {b < 0 ? '-' : '+'} {formatNum(Math.abs(b))}P
              </div>
              <div>
                <span className="text-slate-400">Regresi Penawaran:</span> <br/>
                Qs(P) = {formatNum(c)} {d < 0 ? '-' : '+'} {formatNum(Math.abs(d))}P
              </div>
              <div className="pt-2 border-t">
                <span className="text-slate-400">Persamaan Diferensial:</span> <br/>
                dP/dt = k({formatNum((a - c))} {b - d < 0 ? '-' : '+'} {formatNum(Math.abs(b - d))}P)
              </div>
              <div className="font-bold text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100">
                <span className="text-emerald-500 font-normal">Solusi Eksak:</span> <br/>
                P(t) = {formatNum(pEq)} + (P₀ - {formatNum(pEq)})e<sup className="text-xs">{formatNum(c2, 6)}t</sup>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-5">
             <div>
               <label className="block text-sm font-semibold mb-1 text-slate-700">Harga Awal (P0) - Rp</label>
               <input 
                 type="number" 
                 value={p0} 
                 onChange={(e) => setP0(Number(e.target.value))}
                 className="w-full border p-2 rounded-lg" 
               />
             </div>
             <div>
               <label className="block text-sm font-semibold mb-1 text-slate-700">Koefisien Sensitivitas (k)</label>
               <div className="flex gap-4 items-center">
                 <input 
                   type="range" 
                   min="0" 
                   max="1000" 
                   step="1" 
                   value={k} 
                   onChange={(e) => setK(Math.max(0, Number(e.target.value)))}
                   className="flex-1"
                 />
                 <input 
                   type="number" 
                   min="0"
                   value={k} 
                   onChange={(e) => setK(Math.max(0, Number(e.target.value)))}
                   className="w-20 border p-2 rounded-lg text-center" 
                 />
               </div>
               <p className="text-xs text-slate-500 mt-1">Catatan: Dalam simulasi ini, nilai k dibagi 1000 agar tidak meledak terlalu cepat secara matematis.</p>
             </div>
             <div>
               <label className="block text-sm font-semibold mb-1 text-slate-700">Waktu Maksimal (Hari)</label>
               <input 
                 type="range" 
                 min="10" 
                 max="100" 
                 step="1" 
                 value={tMax} 
                 onChange={(e) => setTMax(Number(e.target.value))}
                 className="w-full"
               />
               <div className="text-right text-xs text-slate-500 font-mono mt-1">{tMax} hari</div>
             </div>
          </div>

          <div className="lg:col-span-2 bg-slate-50 rounded-xl p-4 border flex flex-col items-center justify-center">
             <div className="w-full h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={generateData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                   <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                   <XAxis dataKey="time" label={{ value: "Waktu (Hari)", position: "insideBottom", offset: -10 }} />
                   <YAxis label={{ value: "Harga (Rp)", angle: -90, position: "insideLeft" }} domain={["auto", "auto"]} />
                   <Tooltip formatter={(val: number) => [`Rp ${val.toLocaleString("id-ID", { maximumFractionDigits: 0})}`, "Harga"]} labelFormatter={(val) => `Hari: ${val}`} />
                   <Line type="monotone" dataKey="price" stroke="#059669" strokeWidth={3} dot={false} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
             <p className="text-center text-sm text-slate-500 mt-2 font-medium">
                Grafik Perubahan Harga Beras Berdasarkan Model Regresi & PDB
             </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
        <div className="p-6 border-b bg-emerald-50">
          <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <Calculator size={24} /> 3. Kalkulator Koefisien Sensitivitas (k)
          </h3>
          <p className="text-sm text-emerald-700">Masukkan observasi perubahan harga di pasar untuk menentukan nilai k. Perhitungan Qd dan Qs akan menggunakan hasil regresi linier di atas berdasarkan nilai rata-rata dari P1 dan P2.</p>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-4 bg-slate-50 p-5 rounded-xl border">
               <h4 className="font-bold text-slate-700 border-b pb-2">Observasi Awal</h4>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-semibold mb-1 text-slate-600">Harga (P1)</label>
                   <input type="number" value={calcData.p1} onChange={(e) => setCalcData({...calcData, p1: Number(e.target.value)})} className="w-full border p-2 rounded text-sm"/>
                 </div>
                 <div>
                   <label className="block text-xs font-semibold mb-1 text-slate-600">Waktu (t1)</label>
                   <input type="number" value={calcData.t1} onChange={(e) => setCalcData({...calcData, t1: Number(e.target.value)})} className="w-full border p-2 rounded text-sm"/>
                 </div>
               </div>
             </div>

             <div className="space-y-4 bg-slate-50 p-5 rounded-xl border">
               <h4 className="font-bold text-slate-700 border-b pb-2">Observasi Akhir</h4>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-semibold mb-1 text-slate-600">Harga (P2)</label>
                   <input type="number" value={calcData.p2} onChange={(e) => setCalcData({...calcData, p2: Number(e.target.value)})} className="w-full border p-2 rounded text-sm"/>
                 </div>
                 <div>
                   <label className="block text-xs font-semibold mb-1 text-slate-600">Waktu (t2)</label>
                   <input type="number" value={calcData.t2} onChange={(e) => setCalcData({...calcData, t2: Number(e.target.value)})} className="w-full border p-2 rounded text-sm"/>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="mt-8 pt-6 border-t flex flex-col items-center">
             <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Hasil Perhitungan</div>
             {computedK !== null ? (
               <div className="flex flex-col items-center">
                 <div className="text-4xl font-mono text-emerald-600 font-bold bg-emerald-50 px-6 py-4 rounded-xl border border-emerald-200">
                    k ≈ {(computedK * 1000).toFixed(2)}
                 </div>
                 <p className="text-center text-slate-500 mt-3 text-sm max-w-lg">
                   Berdasarkan rumus <code>k = (P2 - P1) / [(t2 - t1) × (Qd - Qs)]</code>. 
                   <br/>Nilai di atas sudah dikali 1000 untuk disesuaikan dengan skala input di atas. Nilai k asli: {computedK.toFixed(6)}.
                 </p>
               </div>
             ) : (
               <div className="text-lg text-red-500 font-semibold bg-red-50 px-4 py-2 rounded-lg">
                 Data tidak valid (Δt atau ΔQd-Qs tidak boleh nol)
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

