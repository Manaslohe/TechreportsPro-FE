import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const StatCard = React.memo(({ icon: Icon, label, value, color }) => {
  const colorMap = {
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-200/30 hover:border-amber-300/50',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200/30 hover:border-emerald-300/50',
    rose: 'from-rose-500/10 to-rose-500/5 border-rose-200/30 hover:border-rose-300/50',
    indigo: 'from-indigo-500/10 to-indigo-500/5 border-indigo-200/30 hover:border-indigo-300/50'
  };

  const iconColorMap = {
    amber: 'text-amber-600',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
    indigo: 'text-indigo-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-default group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <Icon className={`${iconColorMap[color]} w-5 h-5 sm:w-6 sm:h-6 opacity-60 group-hover:opacity-100 transition-opacity`} />
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

const RequestStats = React.memo(({ stats }) => {
  const statsConfig = [
    {
      icon: Clock,
      label: "Pending",
      value: stats.pending,
      color: "amber"
    },
    {
      icon: CheckCircle,
      label: "Approved",
      value: stats.approved,
      color: "emerald"
    },
    {
      icon: XCircle,
      label: "Rejected",
      value: stats.rejected,
      color: "rose"
    },
    {
      icon: DollarSign,
      label: "Total Amount",
      value: `₹${stats.totalAmount.toLocaleString()}`,
      color: "indigo"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statsConfig.map((stat, index) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
});

RequestStats.displayName = 'RequestStats';

export default RequestStats;
