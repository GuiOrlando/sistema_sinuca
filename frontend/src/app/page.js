'use client';
import { useEffect, useState } from 'react';
import { Users, DollarSign, Package, TrendingUp, Activity, Calendar } from 'lucide-react';
import { getDashboardStats, getInsumos, getPagamentos } from '@/services/api';

export default function HomePage() {
    const [stats, setStats] = useState({
        totalClientes: 0,
        receitaMensal: 0,
        patrimonioInsumos: 0,
        mensalidadesPagas: 0
    });
    const [userName, setUserName] = useState('Usuário');
    const [loading, setLoading] = useState(true);

    const mesAtual = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData.nome) setUserName(userData.nome);
            } catch (err) {
                console.error("Erro ao ler dados do usuário:", err);
            }
        }

        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [dashboardData, insumosData, pagamentosData] = await Promise.all([
                    getDashboardStats(),
                    getInsumos(),
                    getPagamentos()
                ]);

                const totalInsumos = insumosData.reduce((acc, item) => {
                    const preco = Number(item.preco_custo) || 0;
                    const qtd = Number(item.quantidade_estoque) || 0;
                    return acc + (preco * qtd);
                }, 0);

                const totalMensalidadesPagas = pagamentosData.reduce((acc, pgto) => {
                    if (pgto.status === 'Pago') {
                        return acc + Number(pgto.valor);
                    }
                    return acc;
                }, 0);

                setStats({
                    totalClientes: dashboardData.totalClientes || 0,
                    receitaMensal: dashboardData.receitaMensal || 0,
                    patrimonioInsumos: totalInsumos,
                    mensalidadesPagas: totalMensalidadesPagas
                });
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const cards = [
        { 
            title: 'Total de Clientes', 
            value: stats.totalClientes, 
            icon: <Users size={24} />, 
            color: 'text-blue-400', 
            bg: 'bg-blue-500/10' 
        },
        { 
            title: `Mensalidades (${mesAtual})`, 
            value: `R$ ${stats.mensalidadesPagas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,  
            icon: <DollarSign size={24} />, 
            color: 'text-emerald-400', 
            bg: 'bg-emerald-500/10' 
        },
        { 
            title: 'Valor em Materiais', 
            value: `R$ ${stats.patrimonioInsumos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
            icon: <Package size={24} />, 
            color: 'text-orange-400', 
            bg: 'bg-orange-500/10' 
        }
    ]

    return (
        <div className="p-4 md:p-6 pt-11 md:pt-6 min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#0f172a]">
            <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard Principal</h1>
                    <p className="text-slate-400 text-xs md:text-sm">
                        Bem-vindo ao SinuControl, <span className="text-blue-400 font-semibold">{userName}</span>.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 px-4 py-2 rounded-xl text-slate-300 text-sm font-medium">
                    <Calendar size={18} className="text-blue-500" />
                    <span className="capitalize">{mesAtual} de {new Date().getFullYear()}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {cards.map((card, index) => (
                    <div 
                        key={index} 
                        className="bg-[#1e293b] border border-slate-700 p-5 md:p-6 rounded-2xl shadow-lg hover:border-blue-500/30 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${card.bg} ${card.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">{card.title}</p>
                            <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                                {loading ? (
                                    <div className="h-8 w-24 bg-slate-700 animate-pulse rounded" />
                                ) : (
                                    card.value
                                )}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-8 h-80 flex flex-col items-center justify-center text-slate-500 group hover:border-slate-600 transition-colors">
                    <TrendingUp size={48} className="mb-4 opacity-10 group-hover:opacity-20 transition-opacity" />
                    <span className="text-lg font-semibold text-slate-400">Gráfico Futuro</span>
                </div>
                
                <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-8 h-80 flex flex-col items-center justify-center text-slate-500 group hover:border-slate-600 transition-colors">
                    <Activity size={48} className="mb-4 opacity-10 group-hover:opacity-20 transition-opacity" />
                    <span className="text-lg font-semibold text-slate-400">Gráfico Futuro</span>
                </div>
            </div>
        </div>
    );
}