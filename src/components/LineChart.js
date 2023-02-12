import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

// const labels = ["January", "February", "March", "April", "May", "June"];

// const data = {
//   labels: labels,
//   datasets: [
//     {
//       label: "My First dataset",
//       backgroundColor: "rgb(255, 99, 132)",
//       borderColor: "rgb(255, 99, 132)",
//       data: [0, 10, 5, 2, 20, 30, 45],
//     },
//   ],
// };

const LineChart = ({lables,datas,date}) => {
  return (
    // <div>
    //   <Line data={data} /> 
    // </div>
    <div>
        <Line
      data={{
        labels: lables,
        datasets: [
                {
                  label: date,
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: datas,
                },
              ],
      }}
    />
    </div>
  );
};

export default LineChart;