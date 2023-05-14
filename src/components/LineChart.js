import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";


const LineChart = ({ lables, datas, date }) => {
  return (
    <Line
      data={{
        labels: lables,
        datasets: [
          {
            label: date,
            borderColor: "rgb(0, 0, 0)",
            data: datas,
            tension: 0.35,
            pointRadius:0,
            fill:{
              target:'origin',
              below:'rgb(47,79,79)'
            },
            pointStyle:false
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: `Temperture/Time`,
            color:'black',
            font:{
              size:20
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border:{
              color:'black'
            },
            ticks: {
              font: {
                weight:'bolder'
              },
              color:'black'
            },
            title:{
              display:true,
              text:'Time',
              color:'black',
              font:{
                weight:'bolder'
              }
            }

          },
          y: {
            grid: {
              display: false
            },
            border:{
              color:'black'
            },
            ticks: {
              font: {
                weight:'bolder'
              },
              color:'black'
            },
            title:{
              color:'black',
              display:true,
              text:'Temperture',
              font:{
                weight:'bolder'
              }
            }
          }
        }
      }}
    />


  );
};

export default LineChart;