'use client';
import { useState } from 'react';
import { createEstabelecimento } from '@/services/api';
import { X, Store, Phone, User, MapPin, DollarSign } from 'lucide-react';
import { PatternFormat, NumericFormat } from 'react-number-format';

export default function ModalCadastroBar({ isOpen, onClose, onSucess }) {
    const [formData, setFormData] = useState({
        nome_fantasia: '', 
        responsavel_nome: '', 
        telefone: '', 
        endereco: '', 
        valor_mensalidade: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEstabelecimento(formData);
            onSucess();
            onClose();
            setFormData({ nome_fantasia: '', responsavel_nome: '', telefone: '', endereco: '', valor_mensalidade: '' });
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Cadastrar Novo Bar</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Nome do Estabelecimento</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input 
                                required 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 pl-10 text-white outline-none focus:border-blue-500 transition-all"
                                value={formData.nome_fantasia}
                                onChange={(e) => setFormData({...formData, nome_fantasia: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Responsável</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input 
                                    required 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 pl-10 text-white outline-none focus:border-blue-500 transition-all"
                                    value={formData.responsavel_nome}
                                    onChange={(e) => setFormData({...formData, responsavel_nome: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-slate-500" size={18} />
                                <PatternFormat
                                    format="(##) #####-####"
                                    mask="_"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 pl-10 text-white outline-none focus:border-blue-500 transition-all"
                                    value={formData.telefone}
                                    onValueChange={(values) => setFormData({...formData, telefone: values.formattedValue})}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Endereço</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input 
                                required 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 pl-10 text-white outline-none focus:border-blue-500 transition-all"
                                value={formData.endereco}
                                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Mensalidade (R$)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 text-slate-500" size={18} />
                            <NumericFormat
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="R$ "
                                decimalScale={2}
                                fixedDecimalScale
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 pl-10 text-white outline-none focus:border-blue-500 transition-all"
                                value={formData.valor_mensalidade}
                                onValueChange={(values) => setFormData({...formData, valor_mensalidade: values.floatValue})}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Salvar Bar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}