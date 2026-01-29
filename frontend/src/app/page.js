export default function Home() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Bem-vindo ao Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-slate-700">
          <p className="text-slate-400">Total de Bares</p>
          <p className="text-4xl font-bold">12</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-slate-700">
          <p className="text-slate-400">Mesas Alugadas</p>
          <p className="text-4xl font-bold text-accent">25</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-slate-700">
          <p className="text-slate-400">Pendências</p>
          <p className="text-4xl font-bold text-red-400">2</p>
        </div>
      </div>
    </div>
  );
}