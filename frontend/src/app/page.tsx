export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Defensive Security Operations Platform
        </p>

        <h1 className="mb-6 text-6xl font-bold tracking-tight">
          Cyber<span className="text-cyan-400">Guard</span>
        </h1>

        <p className="mb-8 text-lg leading-8 text-slate-400">
          A centralized platform for security monitoring, threat detection,
          incident management, and operational visibility.
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-medium text-slate-300">
            Platform Status
          </p>

          <p className="mt-2 text-xl font-semibold text-cyan-400">
            Frontend Initialized
          </p>

          <p className="mt-2 text-sm text-slate-500">
            CyberGuard v0.1.0 — Foundation Phase
          </p>
        </div>
      </div>
    </main>
  );
}