import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Loader2 } from "lucide-react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "model", text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Prepare history
    const historyParams = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: historyParams }),
      });
      const data = await res.json();
      
      if (res.status === 429) {
        setMessages((prev) => [...prev, { role: "model", text: data.error || "Batas kuota harian API Anda telah terpenuhi. Silakan tunggu beberapa saat." }]);
      } else if (res.status === 503) {
        setMessages((prev) => [...prev, { role: "model", text: data.error || "Sistem AI sedang sibuk. Mohon tunggu beberapa saat dan coba lagi." }]);
      } else if (data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "model", text: "Maaf, terjadi kesalahan saat memproses jawaban." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "model", text: "Maaf, koneksi ke server AI gagal." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 hover:scale-105 transition-all z-40 ${isOpen ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="bg-emerald-800 text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100/20 text-emerald-100 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">BerasAI Assistant</h3>
                <p className="text-[10px] text-emerald-200">Tanya seputar model matematika</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-200 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 mt-10 space-y-3">
                <Bot size={40} className="mx-auto text-emerald-200" />
                <p className="text-sm">Halo! Saya asisten AI untuk materi Pemodelan Matematika. Ada yang bisa saya bantu tentang laju perubahan harga beras?</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white border text-slate-700 rounded-tl-sm shadow-sm'}`}>
                    <div className={msg.role === 'model' ? "prose prose-sm prose-emerald max-w-none prose-p:my-1 prose-pre:bg-slate-100" : ""}>
                       {msg.role === 'model' ? <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.text}</Markdown> : msg.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
               <div className="flex justify-start">
                 <div className="flex gap-2 max-w-[85%]">
                   <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                     <Bot size={12} />
                   </div>
                   <div className="p-3 rounded-xl bg-white border text-slate-700 rounded-tl-sm shadow-sm flex items-center">
                     <Loader2 size={16} className="animate-spin text-emerald-500" />
                   </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100 z-10">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-full px-4 py-2 text-sm outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-colors shrink-0"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
