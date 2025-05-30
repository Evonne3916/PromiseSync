import React from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CreateHorizontalBarTokenChart = (props) => {
  if (props.graphDataIsFetching === false) {
    let tempLabels = [];
    let values = [];
    for (
      let i = 0;
      i < (props.tokens.length < 4 ? props.tokens.length : 4);
      i++
    ) {
      tempLabels.push(props.tokens[i]["name"]);
      values.push(props.tokens[i]["amount"]);
    }
    const data = {
      labels: tempLabels,
      datasets: [
        {
          label: "Amount of tokens",
          data: values,
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
    const options = {
      indexAxis: "y",
      scales: {
        y: {
          grid: {
            color: "#ffffffa1",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    };

    return (
      <div>
        <Bar data={data} options={options} />
      </div>
    );
  }
};

export { CreateHorizontalBarTokenChart };
