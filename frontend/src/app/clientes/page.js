'use client';
import { useEffect, useState } from 'react';
import { getEstabelecimentos } from '@/services/api';
import ModalCadastroBar from '@/components/modal/ModalCadastroBar';
import { Plus, Store, Phone, User, Loader2 } from 'lucide-react';

export default function ClientesPage() {
    const [bares, setBares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getEstabelecimentos();
            setBares(data);
        } catch (err) {
            console.error("Erro ao buscar bares:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, []);

    return (
        <div className='p-4 md:p-6 pt-11 md:pt-6 min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#0f172a]'>
        
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Bares Parceiros</h1>
                    <p className="text-slate-400 text-xs md:text-sm">Gerencie os estabelecimentos e mensalidades</p>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} /> 
                    <span className="font-semibold text-sm">Novo Bar</span>
                </button>
            </div>

                <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">                <div className="overflow-x-auto">
                    <div className="overflow-x-auto scroll-smooth focus:outline-none">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead className="bg-slate-800/50 text-slate-300 text-[11px] md:text-xs uppercase tracking-widest border-b border-slate-700">
                            <tr>
                                <th className="p-5 font-bold">Estabelecimento</th>
                                <th className="p-5 font-bold">Responsável</th>
                                <th className="p-5 font-bold hidden md:table-cell">Contato</th>
                                <th className="p-5 font-bold">Mensalidade</th>
                                <th className="p-5 font-bold text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800">
                            {bares.map((bar) => (
                                <tr key={bar.id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="p-5 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-400 shrink-0">
                                                <Store size={20} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-slate-200 text-sm md:text-base truncate max-w-[150px] md:max-w-[250px]">
                                                    {bar.nome_fantasia}
                                                </span>
                                                <span className="text-[10px] text-slate-500 md:hidden font-medium">
                                                    {bar.telefone}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-5 align-middle">
                                        <div className='flex items-center gap-2 text-slate-400 text-xs md:text-sm'>
                                            <User size={14} className="text-slate-600 shrink-0" /> 
                                            <span className="truncate max-w-[100px] md:max-w-none">
                                                {bar.responsavel_nome}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-5 align-middle hidden md:table-cell">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <Phone size={14} className="text-slate-600" /> 
                                            {bar.telefone}
                                        </div>
                                    </td>

                                    <td className="p-5 align-middle">
                                        <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1.5 rounded-lg text-[11px] md:text-sm whitespace-nowrap border border-emerald-400/20">
                                            R$ {Number(bar.valor_mensalidade || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </td>

                                    <td className="p-5 align-middle text-center">
                                        <button className="text-blue-400 hover:text-blue-300 text-xs md:text-sm font-bold transition-all px-4 py-2 hover:bg-blue-400/10 rounded-xl">
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                {!loading && bares.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-16 text-center space-y-3 bg-slate-900/20">
                        <Store size={48} className="text-slate-700" />
                        <div className="text-slate-500 font-medium">Nenhum estabelecimento encontrado.</div>
                    </div>
                )}
                
                {loading && (
                    <div className="flex items-center justify-center p-20 space-x-3 text-blue-400">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="font-medium animate-pulse">Buscando dados no servidor...</span>
                    </div>
                )}
            </div>

            <ModalCadastroBar 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSucess={fetchData}
            />
        </div>
    );
}