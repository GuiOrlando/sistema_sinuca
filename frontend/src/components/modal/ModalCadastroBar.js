'use client';
import { useEffect, useState } from "react";
import { createEstabelecimento, updateEstabelecimento } from "@/services/api";
import { X, Store, Phone, User, MapPin, DollarSign, Save, Hash } from 'lucide-react';
import { PatternFormat, NumericFormat } from "react-number-format";

export default function ModalCadastroBar({ isOpen, onClose, onSucess, selectedBar }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome_fantasia: '',
        responsavel_nome: '',
        telefone: '',
        endereco: '',
        valor_mensalidade: '',
        quantidade_mesas: ''
    });

    useEffect(() => {
        if (selectedBar) {
            setFormData({
                nome_fantasia: selectedBar.nome_fantasia || '',
                responsavel_nome: selectedBar.responsavel_nome || '',
                telefone: selectedBar.telefone || '',
                endereco: selectedBar.endereco || '',
                valor_mensalidade: selectedBar.valor_mensalidade || '',
                quantidade_mesas: selectedBar.quantidade_mesas || ''
            });
        } else {
            setFormData({
                nome_fantasia: '',
                responsavel_nome: '',
                telefone: '',
                endereco: '',
                valor_mensalidade: '',
                quantidade_mesas: ''
            });
        }
    }, [selectedBar, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (selectedBar) {
                await updateEstabelecimento(selectedBar.id, formData);
            } else {
                await createEstabelecimento(formData);
            }
            onSucess();
            onClose();
        } catch (err) {
            alert(err.message || "Erro ao salvar bar");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-card border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {selectedBar ? 'Editar Bar' : 'Novo Bar'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Nome Fantasia</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                required
                                type="text"
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Ex: Bar do Totó"
                                value={formData.nome_fantasia}
                                onChange={(e) => setFormData({...formData, nome_fantasia: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Responsável</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                                    placeholder="Nome do dono"
                                    value={formData.responsavel_nome}
                                    onChange={(e) => setFormData({...formData, responsavel_nome: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-slate-500" size={18} />
                                <PatternFormat
                                    format="(##) #####-####"
                                    mask="_"
                                    required
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                                    placeholder="(00) 00000-0000"
                                    value={formData.telefone}
                                    onValueChange={(values) => setFormData({...formData, telefone: values.formattedValue})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Endereço</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input 
                                required 
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                                placeholder="Rua, Número, Bairro..."
                                value={formData.endereco}
                                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Mensalidade</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-emerald-500" size={18} />
                                <NumericFormat
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="R$ "
                                    decimalScale={2}
                                    fixedDecimalScale
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                                    value={formData.valor_mensalidade}
                                    onValueChange={(values) => setFormData({...formData, valor_mensalidade: values.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Qtd. de Mesas</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 text-blue-500" size={18} />
                                <input
                                    required={!selectedBar}
                                    disabled={!!selectedBar}
                                    type="number"
                                    min="0"
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none disabled:opacity-50"
                                    placeholder="Ex: 4"
                                    value={formData.quantidade_mesas}
                                    onChange={(e) => setFormData({...formData, quantidade_mesas: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pb-2">
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
                                    {selectedBar ? 'Salvar Alterações' : 'Cadastrar Bar'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}