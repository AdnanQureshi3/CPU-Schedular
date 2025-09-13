import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const storedStats = JSON.parse(localStorage.getItem("algoStats")) || {};
    setStats(storedStats);
  }, []);

  const sortedEntries = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  const chartData = {
    labels: sortedEntries.map(([algo]) => algo),
    datasets: [
      {
        label: "Runs",
        data: sortedEntries.map(([_, count]) => count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Algorithm Usage Visualization</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Leaderboard</h2>
        <ul className="list-decimal list-inside">
          {sortedEntries.map(([algo, count], idx) => (
            <li key={algo}>
              {algo} — <span className="font-bold">{count}</span> runs
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Bar data={chartData} />
      </div>
    </div>
  );
}
