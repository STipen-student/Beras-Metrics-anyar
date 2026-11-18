import { useState } from "react";
import Dashboard from "./screens/Dashboard";
import CourseProfile from "./screens/CourseProfile";
import CoreMaterial from "./screens/CoreMaterial";
import Simulation from "./screens/Simulation";
import CaseMethod from "./screens/CaseMethod";
import Chatbot from "./components/Chatbot";
import { BookOpen, Presentation, Activity, PenTool, Home } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "profile", name: "Profil Mata Kuliah", icon: BookOpen },
    { id: "material", name: "Materi Pokok", icon: Presentation },
    { id: "simulation", name: "Simulasi", icon: Activity },
    { id: "case", name: "Case Method", icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-emerald-800 text-white flex flex-col shadow-xl flex-shrink-0">
        <div className="p-6 text-center border-b border-emerald-700">
          <h1 className="text-2xl font-bold tracking-wider">BerasMetrics</h1>
          <p className="text-emerald-200 text-xs mt-1 uppercase tracking-widest">Pemodelan Matematika</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white font-medium"
                    : "text-emerald-100 hover:bg-emerald-700/50"
                }`}
              >
                <Icon size={20} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 text-xs text-emerald-400 text-center border-t border-emerald-700">
          © S2 Pend. Matematika UNS
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
          {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === "profile" && <CourseProfile />}
          {activeTab === "material" && <CoreMaterial />}
          {activeTab === "simulation" && <Simulation />}
          {activeTab === "case" && <CaseMethod />}
        </div>
        {/* Floating Chatbot Widget */}
        <Chatbot />
      </main>
    </div>
  );
}
