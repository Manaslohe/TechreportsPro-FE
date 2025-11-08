import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, MessageSquare, Mail, ChevronUp, Zap
} from 'lucide-react';

const Activity24Item = React.memo(({ stat, delay }) => {
  const colorMap = {
    indigo: 'bg-white/15',
    emerald: 'bg-white/15',
    violet: 'bg-white/15',
    cyan: 'bg-white/15'
  };

  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`${colorMap[stat.color]} backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/20`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        {stat.trend === 'up' && <ChevronUp className="w-4 h-4 text-emerald-300" />}
      </div>
      <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">{stat.label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
    </motion.div>
  );
});

Activity24Item.displayName = 'Activity24Item';

const ActivityCard = React.memo(({ dashboardData, itemVariants }) => {
  // Memoized 24h stats
  const last24hStats = useMemo(() => [
    {
      label: 'New Users',
      value: dashboardData.last24h?.users || 0,
      icon: Users,
      color: 'indigo',
      trend: 'up'
    },
    {
      label: 'New Reports',
      value: dashboardData.last24h?.reports || 0,
      icon: FileText,
      color: 'emerald',
      trend: 'up'
    },
    {
      label: 'New Requests',
      value: dashboardData.last24h?.requests || 0,
      icon: MessageSquare,
      color: 'violet',
      trend: 'up'
    },
    {
      label: 'New Messages',
      value: dashboardData.last24h?.contacts || 0,
      icon: Mail,
      color: 'cyan',
      trend: 'up'
    }
  ], [dashboardData.last24h]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="group relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20" />
      
      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Last 24 Hours Activity</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {last24hStats.map((stat, index) => (
            <Activity24Item key={stat.label} stat={stat} delay={0.15 + index * 0.05} />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

ActivityCard.displayName = 'ActivityCard';

export default ActivityCard;
