'use client';
import { useState, useEffect } from 'react';
import { DollarSign, Calendar, CheckCircle2, Clock, AlertCircle, Store, Plus, Trash2 } from 'lucide-react';
import { getPagamentos, deletePagamento } from '@/services/api';
import ModalNovoPagamento from '@/components/modal/ModalPagamento';

export default function PagamentosPage() {
    const [pagamentos, setPagamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroData, setFiltroData] = useState('');

    const carregarDados = async () => {
        setLoading(true);
        try {
            const dados = await getPagamentos();
            setPagamentos(dados);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExcluir = async (id) => {
        if (confirm("Tem certeza que deseja remover esse pagamento?")) {
            try {
                await deletePagamento(id);
                await carregarDados();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pago': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Atrasado': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        }
    };

    const pagamentosFiltrados = pagamentos.filter((pgto) => {
        const nomeBar = pgto.nome_bar?.toLowerCase() || "";
        const termoBusca = filtroNome.toLowerCase();
        const dataVencimento = pgto.data_vencimento.split('T')[0];
        const atendeNome = nomeBar.includes(termoBusca);
        const atendeData = filtroData ? dataVencimento === filtroData : true;
        return atendeNome && atendeData;
    });

    return (
        <div className="p-4 md:p-6 pt-11 md:pt-6 min-h-screen w-full bg-[#0f172a]">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Pagamentos</h1>
                    <p className="text-slate-400 text-xs md:text-sm">Gestão de mensalidades e recebimentos.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20 cursor-pointer"
                >
                    <Plus size={20} />
                    <span className="font-semibold text-sm">Novo Registro</span>
                </button>
            </header>

            <div className='flex flex-col md:flex-row gap-4 mb-6'>
                <div className='flex-1'>
                    <input
                        type='text'
                        placeholder='Buscar por nome do bar...'
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="w-full bg-[#1e293b] border border-slate-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                </div>

                <div className='w-full md:w-48'>
                    <input
                        type='date'
                        value={filtroData}
                        onChange={(e) => setFiltroData(e.target.value)}
                        className="w-full bg-[#1e293b] border border-slate-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                </div>

                {(filtroNome || filtroData) && (
                    <button
                        onClick={() => { setFiltroNome(''); setFiltroData(''); }}
                        className="text-slate-400 hover:text-white text-xs font-medium transition-colors"
                    >
                        Limpar Filtros
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-slate-500 text-center py-10">Carregando dados...</div>
                ) : pagamentosFiltrados.length > 0 ? (
                    pagamentosFiltrados.map((pgto) => (
                        <div key={pgto.id} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-500 transition-colors group">                        
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-[#0f172a] rounded-2xl text-blue-400 border border-slate-700">
                                    <Store size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{pgto.nome_bar || `Bar ID: ${pgto.id_estabelecimento}`}</h3>
                                    <div className="space-y-1 mt-1">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Calendar size={14} />
                                            Vencimento: {new Date(pgto.data_vencimento).toLocaleDateString('pt-BR')}
                                        </div>
                                        {pgto.data_pagamento && (
                                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                                                <CheckCircle2 size={14} />
                                                Pago em: {new Date(pgto.data_pagamento).toLocaleDateString('pt-BR')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                                <div className="flex flex-col items-center md:items-end">
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
                                <button
                                    onClick={() => handleExcluir(pgto.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                                    title='Excluir'
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>                        
                    ))
                ) : (
                    <div className="text-slate-400 text-center py-10 border border-dashed border-slate-700 rounded-2xl">
                        Nenhum pagamento encontrado com os filtros aplicados.
                    </div>
                )}
            </div>

            <ModalNovoPagamento 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={carregarDados} 
            />
        </div>
    );
}