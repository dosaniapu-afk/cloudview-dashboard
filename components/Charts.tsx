import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CloudResource, CloudProvider } from '../types';

interface ChartsProps {
  data: CloudResource[];
  providerFilter: CloudProvider;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const CostPieChart: React.FC<ChartsProps> = ({ data, providerFilter }) => {
  // Logic: If 'All', group by Provider. If Specific, group by Service Name.
  const isAll = providerFilter === 'All';
  
  const groupedData = data.reduce((acc, curr) => {
    const key = isAll ? curr.provider : curr.serviceName;
    if (!acc[key]) acc[key] = 0;
    acc[key] += curr.monthlyCost;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(groupedData).map(key => ({
    name: key,
    value: parseFloat(groupedData[key].toFixed(2))
  })).sort((a, b) => b.value - a.value);

  // If filtered by specific provider, limit slices to avoid clutter
  const displayData = isAll ? chartData : chartData.slice(0, 8);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isAll ? 'Cost Distribution by Provider' : 'Cost Distribution by Service'}
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ResourceBarChart: React.FC<ChartsProps> = ({ data }) => {
  // Logic: Group by Resource Type (Service Name) and count them
  const groupedData = data.reduce((acc, curr) => {
    const key = curr.serviceName;
    if (!acc[key]) acc[key] = 0;
    acc[key] += 1;
    return acc;
  }, {} as Record<string, number>);

  // Take top 7 services
  const chartData = Object.keys(groupedData)
    .map(key => ({ name: key, count: groupedData[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Count by Service Type</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical"
            data={chartData} 
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
            <YAxis 
                type="category" 
                dataKey="name" 
                width={120} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#4b5563', fontSize: 12, fontWeight: 500}} 
            />
            <Tooltip 
                cursor={{fill: '#f8fafc'}} 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
            />
            <Bar 
                dataKey="count" 
                fill="#3b82f6" 
                radius={[0, 4, 4, 0]} 
                barSize={24}
                name="Resources"
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};