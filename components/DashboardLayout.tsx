import React, { useState, useEffect } from 'react';
import { LayoutDashboard, AlertCircle, Network, Settings, Cloud, Bell, User, Search, Menu, Command } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time for CET (Central European Time)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', // Represents CET/CEST
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Formatting to YYYY-MM-DD HH:mm:ss
  const parts = formatter.formatToParts(time);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value;
  const displayString = `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;

  return (
    <div className="flex flex-col items-end">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">System Time (CET)</span>
      <span className="text-sm font-mono text-gray-700 font-semibold tabular-nums">
        {displayString}
      </span>
    </div>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentTab, onTabChange }) => {
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-inter">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col shadow-2xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#020617]">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              CloudView
            </span>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</div>
          <nav className="space-y-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                currentTab === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 mr-3 ${currentTab === 'dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium text-sm">Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('alerts')}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                currentTab === 'alerts' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <AlertCircle className={`w-5 h-5 mr-3 ${currentTab === 'alerts' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <div className="flex-1 flex justify-between items-center">
                <span className="font-medium text-sm">Alerts</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
              </div>
            </button>

            <button
              onClick={() => onTabChange('topology')}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                currentTab === 'topology' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Network className={`w-5 h-5 mr-3 ${currentTab === 'topology' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium text-sm">Service Map</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800 bg-[#0f172a]">
           <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mb-2">
            <Settings className="w-5 h-5 mr-3 text-slate-500" />
            <span className="font-medium text-sm">Settings</span>
          </button>
          
          <div className="flex items-center gap-3 mt-4 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-slate-700 shadow-sm">
              DA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">DevOps Admin</p>
              <p className="text-xs text-slate-400 truncate">admin@cloudview.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#f8fafc]">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 sticky top-0">
          
          {/* Search Bar */}
          <div className="flex items-center w-96">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                placeholder="Search resources, services, or tags..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <div className="flex items-center border border-gray-200 rounded px-1.5 py-0.5 bg-gray-100">
                    <Command className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-[10px] text-gray-500 font-medium">K</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <LiveClock />
            
            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-auto custom-scrollbar p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};