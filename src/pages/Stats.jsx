import React, { useState } from "react";
import Header from "../components/header";
import StatsPage from "../components/StatsPage";
import DailyStatsPage from "../components/DailyStatePage";

function Stats() {
  const [view, setView] = useState("leaderboard"); // default view

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Statistics</h1>

        {/* Selector */}
        <div className="flex justify-center mb-8">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="leaderboard">Algorithm Leaderboard</option>
            <option value="daily">Daily Run History</option>
          </select>
        </div>

        {/* Dynamic content */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          {view === "leaderboard" ? <StatsPage /> : <DailyStatsPage />}
        </div>
      </div>
    </div>
  );
}

export default Stats;
