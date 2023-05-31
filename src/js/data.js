const chartOptions = {
    scales: {
        r: {
            pointLabels: {
                font: {
                    family: 'Helvetica, sans-serif',
                    size: 12
                },
                color: 'white'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
            },
            angleLines: {
                color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
                font: {
                    family: 'Helvetica, sans-serif',
                    size: 12
                },
                beginAtZero: true,
                max: 100,
                stepSize: 20,
                backdropColor: 'rgba(0, 0, 0, 0)',
                color: 'rgba(255, 255, 255, 0.5)',
            },
        },
    },
    elements: {
        line: {
            borderWidth: 2,
        },
        point: {
            radius: 4,
            borderWidth: 2,
        },
    },
    plugins: {
        legend: {
            display: false,
        }
    }
}

const chartPointBackgroundColor = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)'
]

function dataInfoChart(specialAttack, attack, defense, specialDefence, hp, speed, speciesColor) {
    return {
        labels: ['special-defense', 'attack', 'defense', 'special-attack', 'hp', 'speed'],
        datasets: [
            {
                label: ' value',
                data: [specialAttack, attack, defense, specialDefence, hp, speed],
                fill: true,
                backgroundColor: 'rgba(240, 80, 48, 0.2)',
                borderColor: speciesColor,
                pointBackgroundColor: chartPointBackgroundColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: speciesColor
            }
        ]
    };
}