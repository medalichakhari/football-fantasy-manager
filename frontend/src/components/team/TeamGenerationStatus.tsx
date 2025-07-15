import { Users } from "lucide-react";
import { LoadingSpinner } from "../ui/states";

interface TeamGenerationStatusProps {
  onGenerateTeam: () => void;
  isGenerating: boolean;
}

export const TeamGenerationStatus = ({
  onGenerateTeam,
  isGenerating,
}: TeamGenerationStatusProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-lg w-full mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isGenerating
                ? "Your Team is Being Generated! 🚀"
                : "Welcome to Football Fantasy Manager!"}
            </h2>
            <p className="text-gray-600">
              {isGenerating
                ? "We're assembling your perfect team with 20 players and a $5,000,000 budget. You'll receive an email notification when it's ready!"
                : "Let's get you started by generating your team with 20 players and $5,000,000 budget."}
            </p>
          </div>

          {isGenerating ? (
            <div className="space-y-6">
              <LoadingSpinner size="lg" className="mx-auto" />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📧 Email Notification
                </p>
                <p className="text-xs text-blue-600">
                  We'll send you an email as soon as your team is ready. You can
                  safely close this page and come back later.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Team generation typically takes 30-60 seconds...
              </p>
            </div>
          ) : (
            <button
              onClick={onGenerateTeam}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Generate My Team
            </button>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Your team will include:
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• 3 Goalkeepers</div>
              <div>• 6 Defenders</div>
              <div>• 6 Midfielders</div>
              <div>• 5 Attackers</div>
              <div>• $5,000,000 transfer budget</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
