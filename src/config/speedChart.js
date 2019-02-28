export default {
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