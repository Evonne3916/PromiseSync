import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const CreateDoughnutTokenGraph = (props) => {
  if (props.graphDataIsFetching === false) {
    let tempLabels = [];
    let values = [];
    for (
      let i = 0;
      i < (props.tokens.length < 4 ? props.tokens.length : 4);
      i++
    ) {
      tempLabels.push(props.tokens[i]["name"]);
      values.push(props.tokens[i]["totalValueUSD"]);
    }
    const data = {
      labels: tempLabels,
      datasets: [
        {
          label: "Total $ of tokens",
          data: values,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
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
    return <Doughnut data={data} />;
  }
};

export { CreateDoughnutTokenGraph };
