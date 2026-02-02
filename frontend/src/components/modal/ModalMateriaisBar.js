'use client';
import { useState, useEffect } from 'react';
import { getInsumos, updateBarInsumos } from '@/services/api';
import { X, Package, Plus, Trash2, Loader2 } from 'lucide-react';
// import { parse } from 'next/dist/build/swc/generated-native';

export default function ModalMateriaisBar({ isOpen, onClose, bar }) {
    const [materiaisDisponiveis, setMateriaisDisponiveis] = useState([]);
    const [selecionados, setSelecionados] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() =>{
        if (isOpen) {
            const loadInsumos = async () => {
                const data = await getInsumos();
                setMateriaisDisponiveis(data);
            };
            loadInsumos();
        }
    }, [isOpen]);

    const adicionarMaterial = (id) => {
        if (!id) return;
        const jaExiste = selecionados.find(s => s.id === id);
        if (jaExiste) return;

        const material = materiaisDisponiveis.find(m => m.id === parseInt(id));
        setSelecionados([...selecionados, {...material, quantidade: 1 }]);
    };

    const atualizarQtd = (id, novaQtd) => {
        setSelecionados(selecionados.map(s => s.id === id ? {...s, quantidade: Math.max(1, novaQtd)} : s));
    }

    const remover = (id) => setSelecionados(selecionados.filter(s => s.id !== id));

    const handleSalvar = async () => {
        setLoading(true);
        try {
            await updateBarInsumos(bar.id, { insumos: selecionados });
            onClose();
        } catch (error) {
            alert("Erro ao salvar materiais");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <Package className='text-blue-400' size={24} />
                        <span>Materiais: { bar?.nome_fantasia }</span>
                    </div>
                    <button onClick={onClose} className='text-slate-400 hover:text-white transition-colors cursor-pointer'>
                        <X size={20} />
                    </button>
                </div>

                <div className='p-6 space-y-4'>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Adicionar Material</label>
                        <select
                            onChange={(e) => adicionarMaterial(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
                        >
                            <option value="">Selecione um material...</option>
                            {materiaisDisponiveis.map(m => (
                                <option key={m.id} value={m.id}>{m.nome} ({m.unidade_medida})</option>
                            ))}
                        </select>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {selecionados.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                <span className="text-slate-200 text-sm font-medium">{item.nome}</span>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="number" 
                                        value={item.quantidade}
                                        onChange={(e) => atualizarQtd(item.id, e.target.value)}
                                        className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-1 text-center text-white text-sm"
                                    />
                                    <button onClick={() => remover(item.id)} className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-700 flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-all text-sm font-semibold cursor-pointer">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSalvar}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Salvar Entrega"}
                    </button>
                </div>
            </div>
        </div>
    )
}
