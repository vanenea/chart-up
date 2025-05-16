import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// 注册 Chart.js 组件
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function InteractiveChart() {
    const [dataPoints, setDataPoints] = useState([]);
    const [chartType, setChartType] = useState('line');

    // 从配置文件加载初始数据
    useEffect(() => {
        fetch('/chartup.conf')
            .then(res => res.json())
            .then(raw => {
                const parsed = raw.map(item => ({
                    date: item.date,
                    Y: Number(item.Y),
                    D: Number(item.D),
                    sum: Number(item.Y) + Number(item.D),
                }));
                setDataPoints(parsed);
            })
            .catch(err => console.error('无法加载 chartup.conf:', err));
    }, []);

    const chartData = {
        labels: dataPoints.map(dp => dp.date),
        datasets: [
            {
                label: 'Y',
                data: dataPoints.map(dp => dp.Y),
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.2)',
                fill: false,
            },
            {
                label: 'D',
                data: dataPoints.map(dp => dp.D),
                borderColor: 'rgba(54,162,235,1)',
                backgroundColor: 'rgba(54,162,235,0.2)',
                fill: false,
            },
            {
                label: '总额',
                data: dataPoints.map(dp => dp.sum),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8 } },
            title: { display: false },
            tooltip: { mode: 'index', intersect: false },
        },
        interaction: {
            mode: 'nearest',
            intersect: false,
        },
        scales: {
            x: { title: { display: false }, ticks: { maxRotation: 0, autoSkip: true } },
            y: { title: { display: false } },
        },
    };

    return (
        <div className="flex flex-col h-screen w-full bg-white">
            {/* 图表区域，占据剩余空间 */}
            <div className="flex-1 p-2">
                {chartType === 'line' ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <Bar data={chartData} options={options} />
                )}
            </div>

            {/* 底部切换栏，固定 */}
            <div className="flex border-t" style={{ height: '50px' }}>
                <button
                    className={`flex-1 flex items-center justify-center text-base ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setChartType('line')}
                >
                    折线图
                </button>
                <button
                    className={`flex-1 flex items-center justify-center text-base ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setChartType('bar')}
                >
                    柱状图
                </button>
            </div>
        </div>
    );
}
