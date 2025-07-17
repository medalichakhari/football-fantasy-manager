import { Users, TrendingUp, DollarSign, Target } from "lucide-react";
import { TeamStats } from "../../types/team";
import { formatCurrency, cn } from "../../utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  subtitle?: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  subtitle,
  className,
}: StatsCardProps) => (
  <div
    className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
      className
    )}
  >
    <div className="flex items-center">
      <div className={cn("p-3 rounded-lg", iconColor)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

interface TeamStatsCardsProps {
  stats: TeamStats;
  budget: number;
  className?: string;
}

export const TeamStatsCards = ({
  stats,
  budget,
  className,
}: TeamStatsCardsProps) => {
  const formation = `${stats.defenders}-${stats.midfielders}-${stats.attackers}`;

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )}
    >
      <StatsCard
        title="Total Players"
        value={stats.totalPlayers}
        subtitle="Required: 15-25 players"
        icon={Users}
        iconColor="bg-blue-100 text-blue-600"
      />

      <StatsCard
        title="Remaining Budget"
        value={formatCurrency(budget)}
        icon={DollarSign}
        iconColor="bg-green-100 text-green-600"
      />

      <StatsCard
        title="Team Value"
        value={formatCurrency(stats.totalValue || 0)}
        icon={TrendingUp}
        iconColor="bg-purple-100 text-purple-600"
      />

      <StatsCard
        title="Formation"
        value={formation}
        icon={Target}
        iconColor="bg-orange-100 text-orange-600"
      />
    </div>
  );
};
