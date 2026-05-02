import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  description?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description,
  color = 'primary' 
}: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface rounded border border-border-light p-6 shadow-card hover:shadow-hover transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-xs font-bold px-1.5 py-0.5 rounded",
            trend >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          )}>
            {trend >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
        {description && (
          <p className="text-text-muted text-xs">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
