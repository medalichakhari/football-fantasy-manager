import { useEffect } from "react";
import { useTeam } from "../../hooks/useTeam";
import { useAuthStore } from "../../store/authStore";
import { LoadingState, ErrorState } from "../../components/ui/states";
import { TeamStatsCards } from "../../components/team/TeamStats";
import { PositionSection } from "../../components/team/PositionSection";
import { PlayersByPosition } from "../../types/team";

const groupPlayersByPosition = (players: any[]): PlayersByPosition => {
  return players.reduce(
    (acc, userPlayer) => {
      const position = userPlayer.player.position;
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(userPlayer.player);
      return acc;
    },
    {
      GK: [],
      DEF: [],
      MID: [],
      ATT: [],
    }
  );
};

export default function MyTeamPage() {
  const { isAuthenticated } = useAuthStore();
  const { teamData, isLoadingTeam, refetchTeam, teamError } = useTeam();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  if (isLoadingTeam) {
    return (
      <LoadingState
        title="Loading your team..."
        description="Please wait while we fetch your player data."
      />
    );
  }

  if (teamError && teamError.includes("Team not found")) {
    return (
      <LoadingState
        title="Setting up your team..."
        description="Your team is being generated automatically. This may take a few moments."
      />
    );
  }

  if (teamError) {
    return (
      <ErrorState
        title="Failed to load team"
        description={teamError}
        onRetry={refetchTeam}
      />
    );
  }

  if (!teamData || teamData.players.length === 0) {
    return (
      <LoadingState
        title="Setting up your team..."
        description="Your team is being generated automatically. This may take a few moments."
      />
    );
  }
  const playersByPosition = groupPlayersByPosition(teamData.players);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Team</h1>
          <p className="text-gray-600">Here's your fantasy football squad.</p>
        </div>

        <TeamStatsCards
          stats={teamData.teamStats}
          budget={teamData.budget}
          className="mb-8"
        />

        <div className="space-y-8">
          <PositionSection
            position="GK"
            players={playersByPosition.GK}
            title="Goalkeepers"
          />
          <PositionSection
            position="DEF"
            players={playersByPosition.DEF}
            title="Defenders"
          />
          <PositionSection
            position="MID"
            players={playersByPosition.MID}
            title="Midfielders"
          />
          <PositionSection
            position="ATT"
            players={playersByPosition.ATT}
            title="Attackers"
          />
        </div>
      </div>
    </div>
  );
}
