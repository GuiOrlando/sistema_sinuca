'use client';
import { useState, useEffect } from 'react';
import { Store, Plus, Search, MapPin, User, Table as TableIcon, Package } from 'lucide-react';
import { getEstabelecimentos, deleteEstabelecimento, getInsumos } from '@/services/api';
import ModalCadastroBar from '@/components/modal/ModalCadastroBar';
import TableActions from '@/components/buttons/TableActions';

export default function BaresPage() {
    const [bares, setBares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBar, setSelectedBar] = useState(null);

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

    const handleEdit = (bar) => {
        setSelectedBar(bar);
        setIsModalOpen(true);
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

    const handleOpenNewModal = () => {
        setSelectedBar(null);
        setIsModalOpen(true);
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
                        <Store className="text-blue-400" /> Gerenciamento de Bares
                    </h1>
                    <p className="text-slate-400 text-sm">Controle estabelecimentos, mesas e entregas.</p>
                </div>
                <button 
                    onClick={handleOpenNewModal}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} /> Novo Bar
                </button>
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
                    [1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-[#1e293b] animate-pulse rounded-2xl border border-slate-700" />)
                ) : baresFiltrados.length > 0 ? (
                    baresFiltrados.map((bar) => (
                        <div key={bar.id} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:border-slate-500 transition-all group relative">
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
                                    onEdit={() => handleEdit(bar)} 
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

                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <TableIcon size={16} className="text-purple-400" />
                                        <span className="text-sm font-semibold">{bar.total_mesas || 0} Mesas</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <Package size={16} className="text-orange-400" />
                                        <span className="text-sm font-semibold underline decoration-orange-400/30 cursor-help" title="Clique para ver histórico">
                                            Entregas
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-600 font-mono italic">ID #{bar.id}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
                        <Store size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">Nenhum bar encontrado com os termos da busca.</p>
                    </div>
                )}
            </div>

            <ModalCadastroBar 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSucess={fetchData} 
                selectedBar={selectedBar} 
            />
        </div>
    );
}