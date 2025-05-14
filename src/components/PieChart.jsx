import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./PieChart.css";

const processDataForPieChart = (data) => {
  const categories = {};

  data.forEach((item) => {
    if (categories[item.category]) {
      categories[item.category] += parseInt(item.price, 10);
    } else {
      categories[item.category] = parseInt(item.price, 10);
    }
  });

  return Object.keys(categories).map((category, i) => ({
    id: i,
    name: category,
    value: categories[category],
  }));
};

const RoundChart = ({ data }) => {
  const processedData = processDataForPieChart(data);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <PieChart className="chart " width={400} height={400}>
      <Pie
        data={processedData}
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={true}
      >
        {processedData.map((entry) => (
          <Cell key={`cell-${entry.id}`} fill={COLORS[entry.id % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend className="chart-legend" />
    </PieChart>
  );
};

export default RoundChart;