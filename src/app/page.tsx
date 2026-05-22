export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-obsidian-bg text-zinc-100">
      <div className="w-full max-w-md bg-obsidian-card border border-white/5 p-8 rounded-3xl shadow-xl shadow-neon-purple/5 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          2026 MEB AGS
        </h1>
        <p className="text-sm text-neon-purple font-medium tracking-wide mb-6">
          Odaklan. Hatırla. Başar.
        </p>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          Sınav hazırlık sürecinizi oyunlaştıran, yüksek odaklı ve dopamin destekli bilgi kartı uygulaması çok yakında burada!
        </p>
        <div className="inline-flex h-2 w-2 rounded-full bg-neon-purple animate-ping"></div>
      </div>
    </main>
  );
}

