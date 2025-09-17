// * React Imports
import { useState } from "react";

// * React-Chart Type Imports
import { Bar } from "react-chartjs-2";

// * ChartJS Imports
import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

// * Utility Imports
import CustomTextField from "@/@core/component/mui/text-field";
import { formatDay, formatDate } from "@/@core/utils/format";

// * MUI Imports
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import { Padding } from "@mui/icons-material";

Chartjs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const generateLabels = (range: string) => {
  let labels = [];
  let today = new Date();

  if (range === "weekly") {
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      labels.push(formatDay(date));
    }
  } else {
    for (let i = 0; i < 4; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(formatDate(date));
    }
  }
  return labels;
};

const Chart = () => {
  const [intervals, setIntervals] = useState<string>("weekly");

  // Dummy Data
  const data = {
    labels: generateLabels(intervals),
    datasets: [
      {
        label: "Job Views",
        data:
          intervals === "weekly"
            ? [65, 59, 80, 81, 56, 55, 40]
            : [200, 149, 82, 102],
        fill: false,
        backgroundColor: "rgb(230, 28, 49)",
        borderColor: "rgba(230, 28, 49, 0.5)",
        borderRadius: 7,
      },
      {
        label: "Job Applications",
        data:
          intervals === "weekly"
            ? [28, 48, 40, 19, 86, 27, 90]
            : [121, 100, 98, 29],
        fill: true,
        backgroundColor: "rgb(232, 232, 232)",
        borderColor: "rgba(232, 232, 232, 0.5)",
        borderRadius: 7,
      },
    ],
  };
  // Bar Chart Options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        align: "end" as const,
      },
    },
  };

  return (
    <Paper
      sx={{
        p: 3,
        width: "100%",
        my: 4,
      }}
    >
      <CustomTextField
        select
        fullWidth
        size="small"
        variant="standard"
        value={intervals}
        onChange={(e) => setIntervals(e.target.value)}
        sx={{ maxWidth: 300 }}
      >
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </CustomTextField>
      <Bar options={options} data={data} />
    </Paper>
  );
};

export default Chart;
