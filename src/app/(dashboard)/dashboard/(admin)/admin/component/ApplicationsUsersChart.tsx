import { useEffect, useState } from "react";
import { getAdminStats } from "@/@core/services/stats";
import { Line } from "react-chartjs-2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// * ChartJS Imports
import {
  Chart as Chartjs,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chartjs.register(
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const SupText = styled("span")(() => ({
  color: "#335CFF",
}));

const SubText = styled("span")(() => ({
  color: "#AAAAAA",
  fontWeight: 400,
}));

export const ApplicationUserChart = () => {
  const [intervals, setIntervals] = useState<string>("weekly");
  const [stats, setStats] = useState<any>(null); // Store API data

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        setStats(response); // Use response directly (no `.data`)
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  // **Handle loading state**
  if (!stats) {
    return <Typography>Loading...</Typography>;
  }

  // **Generate Labels for Weekly or Monthly View**
  const generateLabels = (range: string) => {
    let labels = [];
    let today = new Date();
    if (range === "weekly") {
      for (let i = 0; i < 7; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        labels.push(date.toLocaleDateString("en-US", { month: "short" }));
      }
    }
    return labels.reverse();
  };

  const data = {
    labels: generateLabels(intervals),
    datasets: [
      {
        label: "Total Applications",
        data: new Array(7).fill(stats.total_applications), // Mock data from API
        fill: false,
        borderColor: "rgba(230, 28, 49, 0.5)",
        borderRadius: 7,
      },
      {
        label: "Total Users",
        data: new Array(7).fill(stats.total_users), // Mock data from API
        fill: true,
        borderColor: "rgba(51, 92, 255, 0.5)",
        borderRadius: 7,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        align: "end" as "center" | "end" | "start", // Explicitly cast to correct type
      },
    },
  };
  

  return (
    <Paper sx={{ p: 3, width: "100%", my: 4 }}>
      <Typography sx={{ fontWeight: 600, color: "primary.main" }}>
        Companies <SubText>vs</SubText> <SupText>Applications</SupText>
      </Typography>
      <Line options={options} data={data} />
    </Paper>
  );
};
