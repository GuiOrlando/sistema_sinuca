'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Usuário cadastrado com sucesso!");
                router.push('/login');
            } else {
                const error = await response.json();
                alert(error.error || "Erro ao cadastrar");
            }
        } catch (err) {
            alert("Erro na conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-slate-700 shadow-2xl">
                
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-xl bg-blue-500/10 mb-4">
                        <User className="text-blue-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Novo Usuário</h1>
                    <p className="text-slate-400 text-sm mt-1">Cadastre um novo administrador para o sistema.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Nome Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                required
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors text-white text-sm"
                                placeholder="Seu nome"
                                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">E-mail de Acesso</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                required
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors text-white text-sm"
                                placeholder="Email"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="password" 
                                required
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors text-white text-sm"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Cadastrar Usuário'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <Link href="/login" className="text-slate-500 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
                        <ArrowLeft size={16} /> Voltar para o Login
                    </Link>
                </div>
            </div>
        </div>
    );
}