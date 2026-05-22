import { LoginForm } from "@/components/LoginForm";

export default function AdminGirisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#090a0f] text-zinc-100">
      <div className="w-full max-w-md bg-[#12131a]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-2xl shadow-violet-500/5">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Yönetici Girişi
          </h1>
          <p className="text-xs text-slate-400">
            AGS Bilgi Kartı Yönetim Paneli
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
