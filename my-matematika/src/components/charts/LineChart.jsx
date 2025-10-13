// src/components/charts/LineChart.jsx
import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

/**
 * @param {{ labels?: string[], data?: number[], height?: number }} props
 */
export default function LineChart({ labels = [], data = [], height = 220 }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");

        if (chartRef.current) {
        chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
            {
                label: "Aktivitas",
                data,
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 3,
                backgroundColor: "rgba(37,99,235,0.12)",
                borderColor: "rgba(37,99,235,1)",
            },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "rgba(15,23,42,0.05)" } },
            },
        },
        });

        return () => chartRef.current?.destroy();
    }, [labels, data]);

    return (
        <div style={{ height: `${height}px` }} class="w-full">
        <canvas ref={canvasRef} />
        </div>
    );
}
