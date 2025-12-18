import React from 'react';
import { CloudResource } from '../types';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend, Cell, CartesianGrid } from 'recharts';

interface TopologyProps {
  data: CloudResource[];
}

export const TopologyMap: React.FC<TopologyProps> = ({ data }) => {
  // 1. Get unique regions from the filtered data and sort them for consistent X-axis mapping
  const regions = Array.from(new Set(data.map(d => d.region))).sort();

  // 2. Generate deterministic jitter to prevent overlap
  // We use the charCode of the Resource ID to create a "random" but constant offset
  const getJitter = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Return a value between -0.35 and 0.35
    return ((hash % 100) / 100 - 0.5) * 0.7;
  };

  const mapData = data.map(d => ({
    x: regions.indexOf(d.region) + 1 + getJitter(d.id), // Base index + jitter
    y: d.monthlyCost,
    // Make bubble much larger if there are incidents to highlight severity
    z: d.incidents === 0 ? 100 : (d.incidents + 1) * 300, 
    name: d.resourceName,
    provider: d.provider,
    region: d.region,
    status: d.status,
    type: d.type,
    environment: d.environment,
    incidents: d.incidents,
    criticality: d.criticality
  }));

  const getProviderColor = (provider: string) => {
    switch(provider) {
        case 'AWS': return '#f59e0b';
        case 'Azure': return '#3b82f6';
        case 'GCP': return '#10b981'; // Adjusted to green for consistency with other charts
        default: return '#8884d8';
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-xl text-sm z-50 min-w-[200px]">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
             <span className="font-bold text-gray-900">{data.name}</span>
             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${data.status === 'Error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                {data.status}
             </span>
          </div>
          <div className="space-y-1">
             <div className="flex justify-between">
               <span className="text-gray-500">Provider:</span>
               <span className="font-medium" style={{color: getProviderColor(data.provider)}}>{data.provider}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">Region:</span>
               <span className="font-medium text-gray-700">{data.region}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">Cost:</span>
               <span className="font-mono font-medium text-gray-900">${data.y.toFixed(2)}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">Environment:</span>
               <span className="font-medium text-gray-700">{data.environment}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500">Criticality:</span>
               <span className="font-medium text-gray-700">{data.criticality}</span>
             </div>
             {data.incidents > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100 text-red-600 font-semibold flex items-center">
                    ! {data.incidents} Active Incidents
                </div>
             )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
      return (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No resources found for this filter.</p>
          </div>
      );
  }

  return (
    <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-lg font-semibold text-gray-900">Regional Cost & Health Distribution</h3>
                   <p className="text-sm text-gray-500 mt-1">
                       Bubbles represent resources. <br/>
                       <strong>X-Axis:</strong> Region, <strong>Y-Axis:</strong> Monthly Cost ($). <br/>
                       <strong>Bubble Size:</strong> Incident Severity (Larger = More Issues).
                   </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#f59e0b] mr-1"></span> AWS</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#3b82f6] mr-1"></span> Azure</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#10b981] mr-1"></span> GCP</div>
                </div>
            </div>
            
            <div className="h-[550px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
                    <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Region" 
                        ticks={regions.map((_, i) => i + 1)} // Explicit ticks for every region
                        tickFormatter={(val) => regions[val - 1] || ''} 
                        domain={[0, regions.length + 1]}
                        interval={0}
                        tick={{fontSize: 11, fill: '#64748b'}}
                        dy={10}
                    />
                    <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Cost" 
                        unit="$" 
                        tick={{fontSize: 11, fill: '#64748b'}}
                        axisLine={false}
                        tickLine={false}
                    />
                    <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Severity" />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Resources" data={mapData} fill="#8884d8" animationDuration={500}>
                        {mapData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getProviderColor(entry.provider)} 
                            fillOpacity={0.7} 
                            stroke={getProviderColor(entry.provider)}
                            strokeWidth={1}
                          />
                        ))}
                    </Scatter>
                </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};