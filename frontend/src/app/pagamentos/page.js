'use client';
import { useState, useEffect } from 'react';
import { DollarSign, Calendar, Search, CheckCircle2, Clock, AlertCircle, Store, Plus } from 'lucide-react';
import { getPagamentos } from '@/services/api';

export default function PagamentosPage() {
    const [pagamentos, setPagamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await getPagamentos();
                setPagamentos(dados);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pago': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Atrasado': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-2">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
                    <p className="text-slate-400 mt-1">Gestão de mensalidades e recebimentos.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-blue-600/20">
                    <Plus size={20} /> Registrar Novo
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {pagamentos.map((pgto) => (
                    <div key={pgto.id} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-500 transition-colors">                        
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-[#0f172a] rounded-2xl text-blue-400 border border-slate-700">
                                <Store size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{pgto.nome_estabelecimento || `Bar ID: ${pgto.id_estabelecimento}`}</h3>
                                <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                    <Calendar size={14} />
                                    Vencimento: {new Date(pgto.data_vencimento).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2">
                            <span className="text-2xl font-black text-white">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pgto.valor)}
                            </span>
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${getStatusStyle(pgto.status)}`}>
                                {pgto.status === 'Pago' && <CheckCircle2 size={14} />}
                                {pgto.status === 'Atrasado' && <AlertCircle size={14} />}
                                {pgto.status === 'Pendente' && <Clock size={14} />}
                                {pgto.status}
                            </span>
                        </div>

                    </div>                        
                ))}
            </div>
        </div>
    )
}