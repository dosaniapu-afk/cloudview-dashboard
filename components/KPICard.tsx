import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'red' | 'green' | 'amber';
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon, color = 'blue' }) => {
  const getColors = () => {
    switch(color) {
      case 'red': return 'bg-red-50 text-red-600 border-red-100';
      case 'green': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'amber': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const trendColor = trend && trend > 0 ? 'text-red-500' : 'text-emerald-500';
  const TrendIcon = trend && trend > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${getColors()}`}>
          {icon}
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center text-sm">
          <TrendIcon className={`w-4 h-4 mr-1 ${trendColor}`} />
          <span className={`font-medium ${trendColor}`}>{Math.abs(trend)}%</span>
          <span className="text-gray-400 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};
