import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';

import Chart from 'chart.js';
import ChartJSPluginStreaming from 'chartjs-plugin-streaming';

(async () => {
    const countText = document.getElementById('count-text');
    const countWorkTime = document.getElementById('count-work-time');
    const countChart = document.getElementById('count-chart');

    let count = 0;

    const res = await fetch('/api/count');
    count = await res.text();
    countText.innerText = count;

    const workStartTime = (new Date()).getTime();

    const countWorkTimeTimer = setInterval(() => {
        const currentTime = (new Date()).getTime();
        const diffTime = new Date(currentTime - workStartTime);
        countWorkTime.innerText = diffTime.toISOString().substr(11, 8);
    }, 1000);
    const countTextTimer = setInterval(async () => {
        const res = await fetch('/api/count');
        count = await res.text();
        countText.innerText = count;
    }, 10 * 1000);

    const ctx = countChart.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: [],
                borderColor: 'rgb(255,255,255)',
                backgroundColor: 'rgb(255,255,255)',
                pointRadius: 0
            }],
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            scales: {
                yAxes: [
                    { display: false }
                ],
                xAxes: [
                    {
                        ticks: { fontColor: 'white' },
                        type: 'realtime',
                        realtime: {
                            duration: 1200 * 1000,
                            refresh: 20 * 1000,
                            delay: 15 * 1000,
                            onRefresh: chart => {
                                chart.data.datasets.forEach(dataset => {
                                    dataset.data.push({
                                        x: Date.now(),
                                        y: count
                                    });
                                });
                            }
                        }
                    }
                ]
            }
        }
    });
})();
