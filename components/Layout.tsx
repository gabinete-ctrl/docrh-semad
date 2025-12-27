
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  BookOpen, 
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { label: 'Novo Evento', icon: <FilePlus size={20} />, path: '/eventos/novo' },
    { label: 'Configurações', icon: <SettingsIcon size={20} />, path: '/configuracoes' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-indigo-900 text-white shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="text-indigo-300" />
          <span className="font-bold text-lg tracking-tight">SEMAD Docs</span>
        </div>
        <button onClick={toggleSidebar} className="p-1 hover:bg-indigo-800 rounded">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-200 fixed md:static z-40
        w-64 h-full md:h-screen bg-indigo-900 text-white flex flex-col shadow-xl
      `}>
        <div className="hidden md:flex items-center gap-3 px-6 py-8 border-b border-indigo-800/50">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SEMAD RH</h1>
            <p className="text-xs text-indigo-300 font-medium opacity-80 uppercase tracking-widest">Documentação</p>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-700 text-white shadow-lg' 
                    : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'}
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-indigo-950/40 border-t border-indigo-800/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">Admin SEMAD</p>
              <p className="text-[10px] text-indigo-400 font-medium">Prefeitura de São Luís</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
