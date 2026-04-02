'use client';
import { useState, useEffect } from 'react';
import { DollarSign, Calendar, CheckCircle2, Clock, AlertCircle, Store, Plus, Trash2, Edit2 } from 'lucide-react';
import { getPagamentos, deletePagamento, updatePagamentoStatus } from '@/services/api';
import ModalNovoPagamento from '@/components/modal/ModalPagamento';

export default function PagamentosPage() {
    const [pagamentos, setPagamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagamentoParaEditar, setPagamentoParaEditar] = useState(null);
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
        if (confirm("Deseja remover este pagamento?")) {
            try {
                await deletePagamento(id);
                await carregarDados();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleBaixaRapida = async (id) => {
        try {
            await updatePagamentoStatus(id, 'Pago');
            await carregarDados();
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pago': 
                return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Atrasado': 
                return 'text-red-500 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
            default: 
                return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        }
    };

    const pagamentosFiltrados = pagamentos.filter((pgto) => {
        const nomeBar = pgto.nome_bar?.toLowerCase() || "";
        const dataVencimento = pgto.data_vencimento?.split('T')[0] || "";
        return nomeBar.includes(filtroNome.toLowerCase()) && (filtroData ? dataVencimento === filtroData : true);
    });

    return (
        <div className="p-4 md:p-6 pt-11 md:pt-6 min-h-screen w-full bg-[#0f172a]">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Pagamentos</h1>
                    <p className="text-slate-400 text-xs md:text-sm">Gestão de mensalidades e cobranças.</p>
                </div>
                <button 
                    onClick={() => { setPagamentoParaEditar(null); setIsModalOpen(true); }}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
                >
                    <Plus size={20} />
                    <span className="font-semibold text-sm">Novo Registro</span>
                </button>
            </header>

            <div className='flex flex-col md:flex-row gap-4 mb-6'>
                <input
                    type='text'
                    placeholder='Buscar bar...'
                    value={filtroNome}
                    onChange={(e) => setFiltroNome(e.target.value)}
                    className="flex-1 bg-[#1e293b] border border-slate-700 text-white px-4 py-2.5 rounded-xl outline-none focus:border-blue-500 text-sm"
                />
                <input
                    type='date'
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                    className="w-full md:w-48 bg-[#1e293b] border border-slate-700 text-white px-4 py-2.5 rounded-xl outline-none focus:border-blue-500 text-sm color-scheme-dark"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-slate-500 text-center py-10">Carregando dados...</div>
                ) : (
                    pagamentosFiltrados.map((pgto) => (
                        <div key={pgto.id} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-500 transition-all">
                            
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#0f172a] rounded-xl text-blue-400 border border-slate-700">
                                    <Store size={22} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">{pgto.nome_bar}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                            <Calendar size={13} /> Vencimento: {new Date(pgto.data_vencimento).toLocaleDateString('pt-BR')}
                                        </div>
                                        {pgto.data_pagamento && (
                                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                                                <CheckCircle2 size={13} /> Pago em: {new Date(pgto.data_pagamento).toLocaleDateString('pt-BR')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:items-center justify-between md:justify-end gap-6 border-t md:border-none border-slate-700/50 pt-4 md:pt-0">
                                <div className="flex flex-col md:items-end">
                                    <span className="text-xl font-black text-white">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pgto.valor)}
                                    </span>
                                    <span className={`flex items-center gap-1 mt-1 text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-md border ${getStatusStyle(pgto.status)}`}>
                                        {pgto.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {pgto.status !== 'Pago' && (
                                        <button 
                                            onClick={() => handleBaixaRapida(pgto.id)} 
                                            className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                                        >
                                            <CheckCircle2 size={14} />
                                            Pagar
                                        </button>
                                    )}
                                    
                                    <div className="flex gap-1 ml-2">
                                        <button 
                                            onClick={() => { setPagamentoParaEditar(pgto); setIsModalOpen(true); }} 
                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                                            title="Editar"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleExcluir(pgto.id)} 
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ModalNovoPagamento 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={carregarDados} 
                dadosEdicao={pagamentoParaEditar} 
            />
        </div>
    );
}