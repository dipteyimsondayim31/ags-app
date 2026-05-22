"use client";

interface BottomNavProps {
  activeTab: "home" | "stats";
  setActiveTab: (tab: "home" | "stats") => void;
  onStudyClick: () => void;
}

export function BottomNav({ activeTab, setActiveTab, onStudyClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#12131a]/90 backdrop-blur-xl border-t border-white/5 pb-5 pt-3">
      <div className="max-w-md mx-auto px-6 flex items-center justify-between relative">
        {/* Ana Sayfa Tab Button */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === "home" ? "text-violet-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold mt-1 tracking-wide">Ana Sayfa</span>
          {activeTab === "home" && (
            <span className="h-1 w-1 rounded-full bg-violet-400 mt-0.5 shadow-md shadow-violet-500"></span>
          )}
        </button>

        {/* Floating Study (+ / Çalış) Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button
            onClick={onStudyClick}
            className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white flex items-center justify-center text-3xl font-light shadow-lg shadow-violet-500/20 border border-violet-400/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Ders Çalışmaya Başla"
          >
            +
          </button>
        </div>

        {/* Placeholder div to push the right nav button */}
        <div className="w-16"></div>

        {/* İstatistikler Tab Button */}
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-all duration-200 cursor-pointer ${
            activeTab === "stats" ? "text-violet-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold mt-1 tracking-wide">İstatistikler</span>
          {activeTab === "stats" && (
            <span className="h-1 w-1 rounded-full bg-violet-400 mt-0.5 shadow-md shadow-violet-500"></span>
          )}
        </button>
      </div>
    </nav>
  );
}
