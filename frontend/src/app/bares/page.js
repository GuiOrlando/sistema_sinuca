'use client';
import { useState, useEffect } from 'react';
import { Store, Plus, Search, MapPin, User, Table as TableIcon, Package, Loader2 } from 'lucide-react';
import { getEstabelecimentos, deleteEstabelecimento } from '@/services/api';
import ModalMateriaisBar from '@/components/modal/ModalMateriaisBar';
import TableActions from '@/components/buttons/TableActions';

export default function BaresPage() {
    const [bares, setBares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInsumosModalOpen, setIsInsumosModalOpen] = useState(false);
    const [barParaInsumos, setBarParaInsumos] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getEstabelecimentos();
            setBares(data);
        } catch (err) {
            console.error("Erro ao carregar bares:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Tem certeza que deseja excluir este bar? Todas as mesas vinculadas também serão removidas.")) {
            try {
                await deleteEstabelecimento(id);
                fetchData();
            } catch (err) {
                alert("Erro ao excluir bar.");
            }
        }
    };

    const handleOpenInsumos = (bar) => {
        setBarParaInsumos(bar);
        setIsInsumosModalOpen(true);
    };

    const baresFiltrados = bares.filter(bar => 
        bar.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bar.responsavel_nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 pt-11 md:pt-6 min-h-screen bg-[#0f172a] text-white">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Store className="text-blue-400" /> Bares e Materiais
                    </h1>
                    <p className="text-slate-400 text-sm">Gerencie a entrega de tokens, giz e tacos por estabelecimento.</p>
                </div>
            </header>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar bar por nome ou responsável..." 
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                        <p className="text-slate-400 animate-pulse">Carregando estabelecimentos...</p>
                    </div>
                ) : baresFiltrados.length > 0 ? (
                    baresFiltrados.map((bar) => (
                        <div key={bar.id} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:border-slate-500 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="max-w-[70%]">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                        {bar.nome_fantasia}
                                    </h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                        <MapPin size={14} className="shrink-0" /> 
                                        <span className="truncate">{bar.endereco}</span>
                                    </div>
                                </div>
                                
                                <TableActions 
                                    label="Bar" 
                                    onEdit={() => handleOpenInsumos(bar)}
                                    onDelete={() => handleDelete(bar.id)} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Responsável</p>
                                    <p className="text-sm flex items-center gap-2 truncate">
                                        <User size={14} className="text-blue-400" /> {bar.responsavel_nome}
                                    </p>
                                </div>
                                <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Mensalidade</p>
                                    <p className="text-sm text-emerald-400 font-bold">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bar.valor_mensalidade)}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-slate-500 text-[10px] uppercase font-bold mb-2 tracking-wider">Materiais em Posse</p>
                                <div className="flex flex-wrap gap-2">
                                    {bar.materiais_entregues ? (
                                        bar.materiais_entregues.split(', ').map((item, index) => {
                                            const [nome, qtd] = item.split(' (');
                                            return (
                                                <span 
                                                    key={index} 
                                                    className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase flex items-center gap-1"
                                                >
                                                    {nome}
                                                    <span className="bg-blue-500/20 px-1 rounded text-white text-[9px]">
                                                        {qtd.replace(')', '')}
                                                    </span>
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="text-slate-600 text-[11px] italic">Nenhum material registrado</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <TableIcon size={16} className="text-purple-400" />
                                        <span className="text-sm font-semibold">{bar.total_mesas || 0} Mesas</span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleOpenInsumos(bar)}
                                        className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 transition-colors group/btn"
                                    >
                                        <Package size={16} />
                                        <span className="text-sm font-semibold underline decoration-orange-400/30 group-hover/btn:decoration-orange-300 cursor-pointer">
                                            Materiais
                                        </span>
                                    </button>
                                </div>
                                <span className="text-[10px] text-slate-600 font-mono italic">ID #{bar.id}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
                        <Store size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">Nenhum bar encontrado.</p>
                    </div>
                )}
            </div>

            <ModalMateriaisBar 
                isOpen={isInsumosModalOpen}
                onClose={() => {
                    setIsInsumosModalOpen(false);
                    fetchData();
                }}
                bar={barParaInsumos}
            />
        </div>
    );
}