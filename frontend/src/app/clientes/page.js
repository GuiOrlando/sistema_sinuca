'use client';
import { useEffect, useState } from 'react';
import { getEstabelecimentos } from '@/services/api';
import ModalCadastroBar from '@/components/modal/ModalCadastroBar';
import { Plus, Store, Phone, User } from 'lucide-react';

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

    useEffect(() => { fetchData(); }, []);

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h1 className="text-2xl font-bold text-white">Bares Parceiros</h1>
                    <p className="text-slate-400 text-sm">Gerencie os estabelecimentos e mensalidades</p>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                    <Plus size={20} /> Novo Bar
                </button>
            </div>

            <div className="bg-card rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-300 text-sm uppercase">
                      <tr>
                        <th className="p-4 font-semibold">Estabelecimento</th>
                        <th className="p-4 font-semibold">Responsável</th>
                        <th className="p-4 font-semibold">Contato</th>
                        <th className="p-4 font-semibold">Mensalidade</th>
                        <th className="p-4 font-semibold text-center">Ações</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-700">
                        {bares.map((bar) => (
                            <tr key={bar.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 shrink-0">
                                            <Store size={18} />
                                        </div>
                                        <span className="font-medium text-slate-200 truncate max-w-[200px]">{bar.nome_fantasia}</span>
                                    </div>
                                </td>

                                <td className="p-4 align-middle text-slate-400 text-sm">
                                    <div className='flex items-center gap-2'>
                                        <User size={14} className="text-slate-500" /> {bar.responsavel_nome}
                                    </div>
                                </td>

                                <td className="p-4 align-middle text-slate-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-slate-500" /> {bar.telefone}
                                    </div>
                                </td>

                                <td className="p-4 align-middle">
                                    <span className="text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full text-sm">
                                        R$ {Number(bar.valor_mensalidade || 0).toFixed(2)}
                                    </span>
                                </td>

                                <td className="p-4 align-middle text-center">
                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors p-2 hover:bg-blue-400/10 rounded-lg">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {bares.length === 0 && !loading && (
                    <div className="p-10 text-center text-slate-500 bg-slate-900/20">
                        Nenhum bar cadastrado ainda.
                    </div>
                )}
                
                {loading && (
                    <div className="p-10 text-center text-blue-400 animate-pulse">
                        Carregando estabelecimentos...
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