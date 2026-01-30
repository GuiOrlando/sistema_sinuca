'use client';
import { useEffect, useState } from 'react';
import { createInsumo, updateInsumo } from '@/services/api';
import { X, Package, Ruler, Hash, DollarSign, Save } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

export default function ModalInsumo({ isOpen, onClose, onSuccess, selectedItem }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        unidade_medida: '',
        quantidade_estoque: '',
        preco_custo: ''
    });

    useEffect(() => {
        if (selectedItem) {
            setFormData({
                nome: selectedItem.nome || '',
                unidade_medida: selectedItem.unidade_medida || '',
                quantidade_estoque: selectedItem.quantidade_estoque || '',
                preco_custo: selectedItem.preco_custo || ''
            });
        } else {
            setFormData({ nome: '', unidade_medida: 'un', quantidade_estoque: '', preco_custo: '' });
        }
    }, [selectedItem, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (selectedItem) {
                await updateInsumo(selectedItem.id, formData);
            } else {
                await createInsumo(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            alert(err.message || "Erro ao salvar material");
        } finally {
            setLoading(false);
        }
    };

return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">

                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Package className="text-blue-500" size={24} />
                        {selectedItem ? 'Editar Material' : 'Novo Material'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nome do Material</label>
                        <div className="relative">
                            <Package className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input 
                                required 
                                type="text"
                                placeholder="Ex: Giz Azul Profissional"
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                value={formData.nome}
                                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unidade</label>
                            <div className="relative">
                                <Ruler className="absolute left-3 top-3 text-slate-500" size={18} />
                                <select 
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                    value={formData.unidade_medida}
                                    onChange={(e) => setFormData({...formData, unidade_medida: e.target.value})}
                                >
                                    <option value="un">Unidade (un)</option>
                                    <option value="cx">Caixa (cx)</option>
                                    <option value="pct">Pacote (pct)</option>
                                    <option value="par">Par (par)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estoque Atual</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    required
                                    type="number"
                                    placeholder="0"
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                                    value={formData.quantidade_estoque}
                                    onChange={(e) => setFormData({...formData, quantidade_estoque: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preço de Custo</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 text-emerald-500" size={18} />
                            <NumericFormat
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                decimalScale={2}
                                fixedDecimalScale
                                placeholder="R$ 0,00"
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                                value={formData.preco_custo}
                                onValueChange={(values) => setFormData({...formData, preco_custo: values.value})}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processando...' : (
                                <>
                                    <Save size={20} />
                                    {selectedItem ? 'Salvar Alterações' : 'Cadastrar Material'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
