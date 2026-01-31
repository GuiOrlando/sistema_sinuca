'use client';
import { useState, useEffect } from 'react';
import { getInsumos, deleteInsumo } from '@/services/api';
import { Package, Plus, Search, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import ModalInsumo from '@/components/modal/ModalInsumo';
import TableActions from '@/components/buttons/TableActions';

export default function MateriaisPage() {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getInsumos();
            setInsumos(data);
        } catch (err) {
            console.error("Erro ao buscar materiais:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, []);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (confirm(`Deseja realmente excluir o material "${item.nome}"?`)) {
            try {
                await deleteInsumo(item.id);
                fetchData();
            } catch (err) {
                alert(err.message || "Erro ao excluir material");
            }
        }
    };

    const filteredInsumos = insumos.filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPatrimonio = insumos.reduce((acc, item) => 
        acc + (parseFloat(item.preco_custo || 0) * parseInt(item.quantidade_estoque || 0)), 0
    );

    return (
        <div className='p-4 md:p-6 pt-11 md:pt-6 min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#0f172a]'>
            
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Materiais</h1>
                    <p className="text-slate-400 text-xs md:text-sm">Controle de estoque e custos de operação</p>
                </div>

                <button 
                    onClick={() => {
                        setSelectedItem(null);
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20 cursor-pointer"
                >
                    <Plus size={20} /> 
                    <span className="font-semibold text-sm">Novo Material</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#1e293b] border border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Itens em Linha</p>
                        <p className="text-xl font-bold text-white">{insumos.length}</p>
                    </div>
                </div>
                <div className="bg-[#1e293b] border border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Patrimônio Total</p>
                        <p className="text-xl font-bold text-white">
                            R$ {totalPatrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                <input 
                    type="text"
                    placeholder="Buscar material pelo nome..."
                    className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto scroll-smooth focus:outline-none">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead className="bg-slate-800/50 text-slate-300 text-[11px] md:text-xs uppercase tracking-widest border-b border-slate-700">
                            <tr>
                                <th className="p-5 font-bold">Material</th>
                                <th className="p-5 font-bold text-center">Quantidade</th>
                                <th className="p-5 font-bold">Custo Unitário</th>
                                <th className="p-5 font-bold text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800">
                            {!loading && filteredInsumos.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="p-5 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-700/50 p-2.5 rounded-xl text-slate-400 shrink-0 border border-slate-600">
                                                <Package size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-200 text-sm md:text-base">
                                                    {item.nome}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                                    Unidade: {item.unidade_medida}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-5 align-middle text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`text-sm md:text-base font-bold ${item.quantidade_estoque <= 5 ? 'text-rose-500' : 'text-slate-200'}`}>
                                                {item.quantidade_estoque}
                                            </span>
                                            {item.quantidade_estoque <= 5 && (
                                                <div className="flex items-center gap-1 text-[9px] text-rose-500 font-black uppercase animate-pulse">
                                                    <AlertCircle size={10} /> Baixo
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="p-5 align-middle text-slate-300">
                                        <span className="text-xs md:text-sm font-medium">
                                            R$ {Number(item.preco_custo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>

                                    <td className="p-5 align-middle text-center">
                                        <TableActions 
                                            onEdit={() => handleEdit(item)}
                                            onDelete={() => handleDelete(item)}
                                            label="material"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredInsumos.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-16 text-center space-y-3 bg-slate-900/20">
                        <Package size={48} className="text-slate-700" />
                        <div className="text-slate-500 font-medium text-sm">Nenhum material encontrado.</div>
                    </div>
                )}
                
                {loading && (
                    <div className="flex items-center justify-center p-20 space-x-3 text-blue-400">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="font-medium animate-pulse text-sm">Atualizando estoque...</span>
                    </div>
                )}
            </div>

            <ModalInsumo 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }}
                onSuccess={fetchData}
                selectedItem={selectedItem}
            />
        </div>
    );
}