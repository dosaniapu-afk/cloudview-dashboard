import React from 'react';
import { CloudResource } from '../types';
import { AlertTriangle, Server, Activity, ShieldAlert, Cpu, Zap, CheckCircle } from 'lucide-react';

interface AlertsPanelProps {
  data: CloudResource[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ data }) => {
  // Filter for errors or stopped/critical items
  const criticalAlerts = data.filter(r => r.status === 'Error' || r.incidents > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-center">
            <div className="p-3 bg-red-100 rounded-lg text-red-600 mr-4">
                <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-red-600 uppercase tracking-wide">Critical Errors</h4>
                <p className="text-3xl font-bold text-gray-900">{data.filter(r => r.status === 'Error').length}</p>
            </div>
        </div>
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600 mr-4">
                <Activity className="w-8 h-8" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-amber-600 uppercase tracking-wide">High Latency</h4>
                <p className="text-3xl font-bold text-gray-900">4</p>
            </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
                <Cpu className="w-8 h-8" />
            </div>
            <div>
                <h4 className="text-sm font-medium text-blue-600 uppercase tracking-wide">High CPU Load</h4>
                <p className="text-3xl font-bold text-gray-900">{data.filter(r => r.cpuUsage > 80).length}</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Active Incidents & Recommendations</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {criticalAlerts.map(alert => (
            <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors group">
              <div className="flex items-start">
                <div className={`flex-shrink-0 p-2 rounded-full mr-4 ${alert.status === 'Error' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  {alert.status === 'Error' ? <AlertTriangle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-medium text-gray-900">
                      {alert.resourceName} ({alert.serviceName})
                    </h4>
                    <span className="text-sm text-gray-500">{alert.region}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Detected {alert.status === 'Error' ? 'Critical Failure' : 'Performance Degradation'}. 
                    CPU: {alert.cpuUsage}%, Memory: {alert.memoryUsage}%.
                  </p>
                  
                  {/* RCA / Suggestion Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                    <p className="font-semibold text-slate-700 mb-1 flex items-center">
                        <Server className="w-3 h-3 mr-1" /> Root Cause Analysis (AI Suggestion):
                    </p>
                    <p className="text-slate-600">
                      {alert.status === 'Error' 
                        ? 'Service health check failed consecutively. Suggest checking security group rules and instance logs for connection timeouts.' 
                        : 'Resource is experiencing high load spikes. Consider vertically scaling to a larger instance type or checking for memory leaks.'}
                    </p>
                    <div className="mt-2 flex space-x-2">
                        <button className="text-xs bg-white border border-gray-300 px-2 py-1 rounded shadow-sm hover:bg-gray-50 text-gray-700">View Logs</button>
                        <button className="text-xs bg-blue-600 border border-blue-600 px-2 py-1 rounded shadow-sm hover:bg-blue-700 text-white">Restart Resource</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {criticalAlerts.length === 0 && (
             <div className="p-10 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
                <p className="text-lg font-medium">No active critical alerts</p>
                <p>All systems are operational.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};