import React from "react";
import { Line } from 'react-chartjs-2';
import { LineChartData } from "../Data";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Linechart = () => {
    const options = {
        responsive: true,        // Make the chart responsive
        maintainAspectRatio: false  // Disable aspect ratio maintenance
    };

    return (
        <div style={{ width: '400px', height: '300px' }}>  {/* Control the chart size */}
            <Line options={options} data={LineChartData} />
        </div>
    );
};

export default Linechart;
