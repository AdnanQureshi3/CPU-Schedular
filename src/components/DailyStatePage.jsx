import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DailyStatsPage() {
  const [dailyStats, setDailyStats] = useState({});

  useEffect(() => {
    const storedStats = JSON.parse(localStorage.getItem("dailyStats")) || {};
    setDailyStats(storedStats);
  }, []);

  // Generate last 30 days labels
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = {
    labels: days,
    datasets: [
      {
        label: "Runs per Day",
        data: days.map((day) => dailyStats[day] || 0),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daily Run Summary (30 Days)</h1>
      <Line data={chartData} />
    </div>
  );
}
