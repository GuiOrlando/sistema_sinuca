'use client';
import { useEffect, useState } from "react";
import { getEstabelecimentos, createPagamento } from "@/services/api";
import { X, DollarSign, Calendar, Store, Save, CheckCircle2 } from 'lucide-react';
import { NumericFormat } from "react-number-format";

export default function ModalNovoPagamento({ isOpen, onClose, onSave }) {
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const initialState = {
        id_estabelecimento: '',
        valor: '',
        data_vencimento: '',
        data_pagamento: '',
        status: 'Pendente'
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (isOpen) {
            getEstabelecimentos()
                .then(setEstabelecimentos)
                .catch(err => console.error("Erro ao carregar bares:", err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createPagamento(formData);
            onSave();
            onClose();
            setFormData(initialState);
        } catch (err) {
            alert(err.message || "Erro ao registrar pagamento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-[#1e293b] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="text-blue-500" size={24} />
                        Novo Pagamento
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Estabelecimento</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-3 text-slate-500" size={18} />
                            <select 
                                required
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                                value={formData.id_estabelecimento}
                                onChange={(e) => setFormData({...formData, id_estabelecimento: e.target.value})}
                            >
                                <option value="" className="bg-[#0f172a]">Selecione o bar pagador...</option>
                                {estabelecimentos.map(bar => (
                                    <option key={bar.id} value={bar.id} className="bg-[#0f172a]">
                                        {bar.nome_fantasia}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Valor</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-emerald-500" size={18} />
                                <NumericFormat
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="R$ "
                                    decimalScale={2}
                                    fixedDecimalScale
                                    required
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                                    value={formData.valor}
                                    onValueChange={(values) => setFormData({...formData, valor: values.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Data de Vencimento</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    type="date" 
                                    required
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all color-scheme-dark"
                                    value={formData.data_vencimento}
                                    onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Data do Recebimento (Se já foi pago)</label>
                        <div className="relative">
                            <CheckCircle2 className={`absolute left-3 top-3 ${formData.status === 'Pago' ? 'text-emerald-500' : 'text-slate-600'}`} size={18} />
                            <input 
                                type="date" 
                                disabled={formData.status !== 'Pago'}
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all color-scheme-dark disabled:opacity-50"
                                value={formData.data_pagamento}
                                onChange={(e) => setFormData({...formData, data_pagamento: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Status Inicial</label>
                        <div className="relative">
                            <CheckCircle2 className="absolute left-3 top-3 text-blue-500" size={18} />
                            <select 
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all appearance-none"
                                value={formData.status}
                                onChange={(e) => {
                                    const newStatus = e.target.value;
                                    setFormData({
                                        ...formData, 
                                        status: newStatus,
                                        data_pagamento: newStatus === 'Pago' ? formData.data_pagamento : ''
                                    });
                                }}
                            >
                                <option value="Pendente">Pendente</option>
                                <option value="Pago">Pago</option>
                                <option value="Atrasado">Atrasado</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
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
                            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
                        >
                            {loading ? 'Gravando...' : <><Save size={20} /> Confirmar</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}