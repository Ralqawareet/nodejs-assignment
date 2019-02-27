<template>
  <div class="container h-100">
    <!-- left container -->
    <div class="container maps-and-bars">
      <!-- row of maps and stats -->
      <div class="row">
        <!-- maps container -->
        <div class="col-6">
          <GoogleMaps :coords="newLocation"/>
        </div>
        <!-- 2 bar charts container -->
        <div class="col-6">
          <div class="container">
            <div>Current speed</div>
            <ProgressBar :counter="speed_value" :label="'km/h'" :max="100"/>
          </div>
          <div class="container">
            <div>State of charge</div>
            <ProgressBar :counter="charge_value" :max="100"/>
          </div>
        </div>
      </div>
      <!-- row of 2 line charts -->
      <div class="row">
        <div class="col-6">
          <LineChart
            :chart-id="'soc'"
            :options="socChart_options"
            :chartData="socChart_data"
            :width="450"
            :height="250"
          />
        </div>
        <div class="col-6">
          <LineChart
            :chart-id="'speed'"
            :options="speedChart_options"
            :chartData="speedChart_data"
            :width="450"
            :height="250"
          />
        </div>
      </div>
    </div>
    <!-- right container for additional comp like list or etc -->
    <div class="contianer"></div>
  </div>
</template>
<script>
import GoogleMaps from "./GoogleMaps";
import ProgressBar from "./ProgressBar";
import LineChart from "./LineChart";
import * as moment from "moment";
export default {
  data() {
    return {
      charge_value: 20,
      speed_value: 50,
      newLocation: [52.394801, 4.846565],
      socChart_data: {
        labels: [],
        datasets: [
          {
            label: "State of charge",
            fill: false,
            backgroundColor: "#f87979",
            data: []
          }
        ]
      },
      socChart_options: {
        elements: {
          line: {
            borderColor: "#f87979"
          },
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "State of charge (%)"
              },
              ticks: {
                stepSize: 20,
                beginAtZero: true,
                max: 100
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      },
      speedChart_data: {
        labels: [],
        datasets: [
          {
            label: "Speed",
            fill: false,
            backgroundColor: "#f87979",
            data: []
          }
        ]
      },
      speedChart_options: {
        tooltip: {
          enabled: false
        },
        elements: {
          line: {
            borderColor: "#f87979"
          },
          point: {
            radius: 0
          }
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Speed (km/h)"
              },
              ticks: {
                stepSize: 5
                // beginAtZero: true
                //   max: 100
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  created() {
    const ws = new WebSocket("ws://localhost:8000");
    ws.onopen = function() {
      console.log("opened connection");
    };
    ws.onmessage = msg => {
      const data = JSON.parse(msg.data);
      this.newLocation = data.gps[0].split("|");
      const d_set = this.socChart_data.datasets[0].data.slice() || [];
      const lbl_set = this.socChart_data.labels.slice() || [];

      const speed_d_set = this.speedChart_data.datasets[0].data.slice() || [];

      d_set.push(parseFloat(data.soc));
      lbl_set.push(moment.unix(data.time).format("HH:mm"));

      speed_d_set.push(parseFloat(data.speed));
      if (d_set.length > 5) {
        d_set.shift();
        lbl_set.shift();
        speed_d_set.shift();
      }

      this.socChart_data = {
        labels: lbl_set,
        datasets: [
          {
            label: "State of charge",
            fill: false,
            backgroundColor: "#f87979",
            data: d_set
          }
        ]
      };
      this.speedChart_data = {
        labels: lbl_set,
        datasets: [
          {
            label: "Speed",
            fill: false,
            backgroundColor: "#f87979",
            data: speed_d_set
          }
        ]
      };
      this.charge_value = parseFloat(data.soc) || 0;
      this.speed_value = parseFloat(data.speed) || 0;
    };
  },
  components: { ProgressBar, LineChart, GoogleMaps }
};
</script>
<style>
</style>
