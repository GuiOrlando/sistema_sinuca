'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Home, Users, Store, Package, Settings, LogOut, Menu, X } from 'lucide-react';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => setIsOpen(!isOpen);

    const menuItems = [
        { name: 'Homepage', icon: <Home size={20} />, href: '/' },
        { name: 'Clientes', icon: <Users size={20} />, href: '/clientes' },
        { name: 'Bares', icon: <Store size={20} />, href: '/bares' },
        { name: 'Materiais', icon: <Package size={20} />, href: '/insumos' },
        { name: 'Configurações', icon: <Settings size={20} />, href: '/configuracoes' },
    ];

    return (
        <>
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-4 z-50">
                <h1 className="text-xl font-bold text-blue-400 italic">SinuControl</h1>
                <button 
                    onClick={toggleSidebar}
                    className="p-2 text-slate-300 hover:text-white"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </header>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
                fixed md:sticky top-0 left-0 z-[70] w-64 bg-[#1e293b] text-foreground h-screen 
                border-r border-slate-700 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="hidden md:block pl-6 pt-6 pb-3">
                    <h1 className="text-2xl font-bold text-blue-400 italic">SinuControl</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-">Gerenciamento Pro</p>
                </div>
        
                <nav className="flex-1 px-4 space-y-2 pt-20 md:pt-0 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
                        >
                            <span className="text-blue-400">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 p-3 w-full text-red-400 hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer">
                        <LogOut size={20} />
                        <span className="font-medium text-sm md:text-base">Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
}