import React, { useState } from 'react';
import { CloudResource } from '../types';
import { MoreHorizontal, AlertTriangle, CheckCircle, PauseCircle, Clock, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface ResourceTableProps {
  data: CloudResource[];
}

export const ResourceTable: React.FC<ResourceTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"><CheckCircle className="w-3 h-3 mr-1.5" /> Running</span>;
      case 'Stopped':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-100"><PauseCircle className="w-3 h-3 mr-1.5" /> Stopped</span>;
      case 'Error':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100"><AlertTriangle className="w-3 h-3 mr-1.5" /> Error</span>;
      case 'Provisioning':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"><Clock className="w-3 h-3 mr-1.5" /> Provisioning</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
           <h3 className="text-lg font-bold text-gray-900">Resource Inventory</h3>
           <p className="text-sm text-gray-500 mt-1">Manage and monitor your cloud assets across providers.</p>
        </div>
        <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Resource Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uptime</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">CPU %</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Memory %</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost (USD)</th>
              <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((resource) => (
              <tr key={resource.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                      {resource.provider === 'AWS' && <div className="w-1 h-6 bg-[#FF9900] rounded-l-md mr-3"></div>}
                      {resource.provider === 'Azure' && <div className="w-1 h-6 bg-[#007FFF] rounded-l-md mr-3"></div>}
                      {resource.provider === 'GCP' && <div className="w-1 h-6 bg-[#34A853] rounded-l-md mr-3"></div>}
                      <span className={`${
                        resource.provider === 'AWS' ? 'text-[#FF9900]' : 
                        resource.provider === 'Azure' ? 'text-[#007FFF]' : 'text-[#34A853]'
                      } font-bold`}>{resource.provider}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{resource.serviceName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{resource.resourceName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(resource.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                  {resource.uptime}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 font-mono">
                    <div className="flex items-center justify-end space-x-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${resource.cpuUsage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${resource.cpuUsage}%` }}></div>
                        </div>
                        <span>{resource.cpuUsage}%</span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 font-mono">{resource.memoryUsage}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold font-mono">${resource.monthlyCost.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, data.length)}</span> of <span className="font-medium text-gray-900">{data.length}</span> results
        </p>
        <div className="flex space-x-2">
            <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};