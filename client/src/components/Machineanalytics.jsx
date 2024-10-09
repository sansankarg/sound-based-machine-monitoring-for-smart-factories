import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom'; // For getting the machine name from route params
import Piechart from './Pie'; // Import the Piechart component
import axios from 'axios'; // Import Axios
import { useAuth } from './AuthContext';
const socket = io('http://localhost:5007');

const MachineAnalytics = () => {
  const { machineId } = useParams(); // Assuming you're passing the machine name through the URL
  const [runningPercentage, setRunningPercentage] = useState(0);
  const [notRunningPercentage, setNotRunningPercentage] = useState(0);
    const {username}=useAuth()

  useEffect(() => {
    // Fetch initial data for the specific machine using Axios
    const fetchData = async () => {
      try {
        // console.log(username)
        // console.log(machine_name)
        const response = await axios.get(`http://localhost:5007/machine-analytics/${machineId}`,{
            params:{username}
        });
        const data = response.data;
        setRunningPercentage(data.running_percentage);
        setNotRunningPercentage(data.not_running_percentage);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();

    // Listen for live updates for the specific machine
    // socket.on(`machine_analytics_${machine_name}`, (data) => {
    //   setRunningPercentage(data.running_percentage);
    //   setNotRunningPercentage(data.not_running_percentage);
    // });

    // Cleanup on component unmount
    return () => {
      socket.off(`machine_analytics_${machineId}`);
    };
  }, [machineId]);

  // Prepare data for Piechart
  const pieChartData = {
    labels: ['Running', 'Not Running'],
    datasets: [
      {
        label: 'Machine Status',
        data: [runningPercentage, notRunningPercentage],
        backgroundColor: ['#36A2EB', '#FF6384'], // Colors for the segments
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div style={{ width: '50%', margin: 'auto' }}>
    <h2>Machine Analytics for {machineId}</h2>
    <p>Running Percentage: {runningPercentage}%</p>
    <p>Not Running Percentage: {notRunningPercentage}%</p>

    {/* Pass the pieChartData to Piechart component */}
    <Piechart data={pieChartData} />

    <button onClick={() => window.history.back()}>Back to Dashboard</button>
  </div>
  );
};

export default MachineAnalytics;
