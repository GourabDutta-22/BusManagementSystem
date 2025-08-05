import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  total?: number;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'emerald' | 'red' | 'amber' | 'purple';
  trend?: string;
}

const colorClasses = {
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    value: 'text-green-600'
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    value: 'text-blue-600'
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    value: 'text-emerald-600'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    value: 'text-red-600'
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    value: 'text-amber-600'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    value: 'text-purple-600'
  }
};

export default function StatsCard({ title, value, total, icon: Icon, color, trend }: StatsCardProps) {
  const classes = colorClasses[color];
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${classes.bg}`}>
          <Icon className={`w-6 h-6 ${classes.text}`} />
        </div>
        {trend && (
          <span className="text-sm font-medium text-gray-500">{trend}</span>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <p className={`text-3xl font-bold ${classes.value}`}>{value}</p>
          {total && (
            <span className="text-sm text-gray-500">/ {total}</span>
          )}
        </div>
        
        {total && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${classes.bg.replace('100', '500')}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
        
        {total && (
          <p className="text-xs text-gray-500">{percentage}% of total</p>
        )}
      </div>
    </div>
  );
}