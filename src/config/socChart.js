export default {
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
}