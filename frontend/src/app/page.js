'use client';
import { useEffect, useState } from 'react';
import { Users, DollarSign, Table as TableIcon, TrendingUp } from 'lucide-react';
import { getDashboardStats } from '@/services/api';

export default function HomePage() {
    const [stats, setStats] = useState({
        totalClientes: 0,
        receitaMensal: 0,
        totalMesas: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
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
            title: 'Receita Mensal', 
            value: `R$ ${Number(stats.receitaMensal).toFixed(2)}`, 
            icon: <DollarSign size={24} />, 
            color: 'text-green-400', 
            bg: 'bg-green-500/10' 
        },
        { 
            title: 'Mesas Alugadas', 
            value: stats.totalMesas, 
            icon: <TableIcon size={24} />, 
            color: 'text-purple-400', 
            bg: 'bg-purple-500/10' 
        },
        { 
            title: 'Crescimento', 
            value: '+12%', 
            icon: <TrendingUp size={24} />, 
            color: 'text-orange-400', 
            bg: 'bg-orange-500/10' 
        },
    ];

    return (
        <div className="p-4 md:p-6 pt-11 md:pt-6 min-h-screen w-full max-w-[100vw] overflow-x-hidden">
            <header className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard Principal</h1>
                <p className="text-slate-400 text-xs md:text-sm">Bem-vindo ao Sinuca Control, Guilherme.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {cards.map((card, index) => (
                    <div 
                        key={index} 
                        className="bg-card border border-slate-700 p-5 md:p-6 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300 group"
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

            <div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className="lg:col-span-2 bg-card border border-slate-700 rounded-2xl p-6 h-64 flex items-center justify-center text-slate-500">
                    Gráfico Futuro
                </div>
                <div className="bg-card border border-slate-700 rounded-2xl p-6 h-64 flex items-center justify-center text-slate-500">
                    Últimas Atividades
                </div>
            </div>
        </div>
    );
}