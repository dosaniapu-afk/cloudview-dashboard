import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { KPICard } from './components/KPICard';
import { CostPieChart, ResourceBarChart } from './components/Charts';
import { ResourceTable } from './components/ResourceTable';
import { AlertsPanel } from './components/AlertsPanel';
import { TopologyMap } from './components/TopologyMap';
import { MOCK_DATA } from './constants';
import { CloudProvider, KPIStats } from './types';
import { Server, AlertOctagon, DollarSign, Filter, RefreshCw, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('All');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Function to handle manual refresh
  const handleRefresh = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 800);
  };

  // Simulate network request when switching providers
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedProvider]);

  // Filter Data
  const filteredData = useMemo(() => {
    if (selectedProvider === 'All') return MOCK_DATA;
    return MOCK_DATA.filter(item => item.provider === selectedProvider);
  }, [selectedProvider]);

  // Calculate KPIs
  const kpiStats: KPIStats = useMemo(() => {
    const totalResources = filteredData.length;
    const activeAlerts = filteredData.filter(i => i.status === 'Error' || i.incidents > 0).length;
    const totalCost = filteredData.reduce((acc, curr) => acc + curr.monthlyCost, 0);
    const avgUptime = filteredData.reduce((acc, curr) => acc + curr.uptime, 0) / totalResources;

    return { totalResources, activeAlerts, totalCost, avgUptime };
  }, [filteredData]);

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white h-32 rounded-xl shadow-sm border border-gray-100"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white h-96 rounded-xl shadow-sm border border-gray-100"></div>
        <div className="bg-white h-96 rounded-xl shadow-sm border border-gray-100"></div>
      </div>
       <div className="bg-white h-96 rounded-xl shadow-sm border border-gray-100"></div>
    </div>
  );

  return (
    <DashboardLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      
      {/* Page Header Area */}
      {currentTab === 'dashboard' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center">
              {selectedProvider === 'All' ? 'Multi-Cloud Overview' : `${selectedProvider} Environment`}
              {isLoading && <RefreshCw className="w-5 h-5 ml-3 text-blue-500 animate-spin" />}
            </h1>
            <div className="flex items-center mt-1 text-sm text-gray-500">
               <span className="flex items-center mr-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                  Live Monitoring
               </span>
               <span className="text-gray-400 mr-2">
                 Last updated: {lastUpdated.toLocaleTimeString('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </span>
               <button 
                  onClick={handleRefresh} 
                  disabled={isLoading}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    isLoading 
                      ? 'bg-blue-50 text-blue-600 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-blue-600 hover:bg-white hover:shadow-sm'
                  }`}
                  title="Refresh Data"
               >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
               </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Date Picker Mock */}
             <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                Last 30 Days
                <ChevronDown className="w-3 h-3 ml-2 text-gray-400" />
             </button>

             {/* Provider Filter */}
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              {['All', 'AWS', 'Azure', 'GCP'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => setSelectedProvider(provider as CloudProvider)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedProvider === provider
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KPICard 
                    title="Total Resources" 
                    value={kpiStats.totalResources.toString()} 
                    icon={<Server className="w-5 h-5" />}
                    color="blue"
                    trend={12}
                  />
                  <KPICard 
                    title="Active Alerts" 
                    value={kpiStats.activeAlerts.toString()} 
                    icon={<AlertOctagon className="w-5 h-5" />} 
                    color={kpiStats.activeAlerts > 5 ? 'red' : 'green'}
                    trend={kpiStats.activeAlerts > 0 ? 5 : -10}
                  />
                  <KPICard 
                    title="Total Monthly Cost" 
                    value={`$${kpiStats.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                    icon={<DollarSign className="w-5 h-5" />}
                    color="amber"
                    trend={-2.5}
                  />
                  <KPICard 
                    title="Avg Uptime (30d)" 
                    value={`${kpiStats.avgUptime.toFixed(2)}%`} 
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    color="green"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CostPieChart data={filteredData} providerFilter={selectedProvider} />
                  <ResourceBarChart data={filteredData} providerFilter={selectedProvider} />
                </div>

                {/* Table */}
                <ResourceTable data={filteredData} />
              </div>
            )}

            {currentTab === 'alerts' && (
              <div className="animate-fade-in">
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Intelligent Alerting</h2>
                    <p className="text-gray-500 mt-1">AI-driven root cause analysis and anomaly detection.</p>
                  </div>
                   <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
                      Configure Rules
                   </button>
                </div>
                <AlertsPanel data={filteredData} />
              </div>
            )}

            {currentTab === 'topology' && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Infrastructure Regional Distribution</h2>
                  <p className="text-gray-500 mt-1">
                    {selectedProvider === 'All' ? 'Global' : selectedProvider} resource mapping by region and cost impact.
                  </p>
                </div>
                <TopologyMap data={filteredData} />
              </div>
            )}
          </>
        )}
      </div>

    </DashboardLayout>
  );
};

export default App;