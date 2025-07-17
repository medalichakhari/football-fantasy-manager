import { Link } from "react-router-dom";
import { ArrowRight, Users, TrendingUp, Trophy } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Management",
      description:
        "Receive your team automatically upon registration with $5M budget and 20 players",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Transfer Market",
      description:
        "Buy players at 95% of asking price, filter by team, player name, and price",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Squad Rules",
      description:
        "Maintain 15-25 players, list your own players for sale at custom prices",
    },
  ];

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Football Fantasy
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-3">
              Manager
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build your dream team, manage transfers, and compete with other
            managers in this fantasy football experience
          </p>

          <Link
            to="/login"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
