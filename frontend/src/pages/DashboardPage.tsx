import { useAuthStore } from "../store/authStore";
import {
  Users,
  TrendingUp,
  DollarSign,
  Trophy,
  Activity,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  change,
  changeType,
}: StatsCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${iconColor}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p
            className={`text-sm ${
              changeType === "positive"
                ? "text-green-600"
                : changeType === "negative"
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </div>
  </div>
);

interface ActivityItemProps {
  action: string;
  value?: string;
  time: string;
  type: "transfer_in" | "transfer_out" | "general";
}

const ActivityItem = ({ action, value, time, type }: ActivityItemProps) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center">
      <div
        className={`p-2 rounded-full mr-3 ${
          type === "transfer_in"
            ? "bg-green-100"
            : type === "transfer_out"
            ? "bg-red-100"
            : "bg-gray-100"
        }`}
      >
        <Activity
          className={`h-4 w-4 ${
            type === "transfer_in"
              ? "text-green-600"
              : type === "transfer_out"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{action}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
    {value && (
      <span
        className={`text-sm font-medium ${
          type === "transfer_in"
            ? "text-green-600"
            : type === "transfer_out"
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {value}
      </span>
    )}
  </div>
);

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Manager!
          </h1>
          <p className="text-gray-600">
            Ready to manage your fantasy football team? Here's your dashboard.
            {user?.email && (
              <span className="ml-1 text-blue-600 font-medium">
                ({user.email})
              </span>
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Team Value"
            value="$50.0M"
            icon={TrendingUp}
            iconColor="bg-green-100 text-green-600"
            change="+2.5% from last week"
            changeType="positive"
          />
          <StatsCard
            title="Budget"
            value="$15.5M"
            icon={DollarSign}
            iconColor="bg-blue-100 text-blue-600"
            change="Available for transfers"
            changeType="neutral"
          />
          <StatsCard
            title="Players"
            value="11/15"
            icon={Users}
            iconColor="bg-purple-100 text-purple-600"
            change="4 spots remaining"
            changeType="neutral"
          />
          <StatsCard
            title="Rank"
            value="#42"
            icon={Trophy}
            iconColor="bg-orange-100 text-orange-600"
            change="↑ 5 places"
            changeType="positive"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/my-team"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <p className="font-medium text-gray-900">View My Team</p>
                <p className="text-sm text-gray-500">
                  Manage your current squad
                </p>
              </Link>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <p className="font-medium text-gray-900">Transfer Players</p>
                <p className="text-sm text-gray-500">Buy and sell players</p>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </h2>
            <div className="space-y-1">
              <ActivityItem
                action="Transferred in: Kevin De Bruyne"
                value="+£12.5M"
                time="2 hours ago"
                type="transfer_in"
              />
              <ActivityItem
                action="Transferred out: Harry Kane"
                value="-£15.0M"
                time="1 day ago"
                type="transfer_out"
              />
              <ActivityItem
                action="Team created"
                time="2 days ago"
                type="general"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
