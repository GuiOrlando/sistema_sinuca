import Link from 'next/link';
import { Home, Users, Store, Package, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Homepage', icon: <Home size={20} />, href: '/' },
    { name: 'Clientes', icon: <Users size={20} />, href: '/clientes' },
    { name: 'Bares', icon: <Store size={20} />, href: '/bares' },
    { name: 'Materiais', icon: <Package size={20} />, href: '/insumos' },
    { name: 'Configurações', icon: <Settings size={20} />, href: '/configuracoes' },
  ];

  return (
    <aside className="w-64 bg-card text-foreground h-screen sticky top-0 border-r border-slate-700 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-accent italic">Sinuca Control</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center gap-3 p-3 w-full text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}