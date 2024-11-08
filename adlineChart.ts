import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

const width = 800;
const height = 600;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });


export const generateBollingerChart = async(stockDates: string[], closePrices: number[], volumes: number[], upperBand: number[], middleBand: number[], lowerBand: number[], bollingerSignal: number[],accumulationDistributionLine: number[]) =>{
  
//async function generateBollingerWithADLChart(stockDates: string[], closePrices: number[], volumes: number[], upperBand: number[], middleBand: number[], lowerBand: number[], bollingerSignal: number[], accumulationDistributionLine: number[]) {
  const configuration: ChartConfiguration<'line' | 'bar'> = {
    type: 'bar',
    data: {
      labels: stockDates,
      datasets: [
        {
          label: 'Price',
          data: closePrices,
          borderColor: 'rgba(54, 162, 235, 0.8)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          type: 'line',
          yAxisID: 'y-axis-price',
          tension: 0.3, // Smooth line
        },
        {
          label: 'Volume',
          data: volumes,
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y-axis-volume',
        },
        {
          label: 'Upper Band',
          data: upperBand,
          borderColor: 'rgba(255, 99, 132, 0.8)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          type: 'line',
          yAxisID: 'y-axis-price',
          tension: 0.3,
          borderDash: [5, 5],
        },
        {
          label: 'Middle Band',
          data: middleBand,
          borderColor: 'rgba(75, 192, 192, 0.8)',
          type: 'line',
          yAxisID: 'y-axis-price',
          tension: 0.3,
        },
        {
          label: 'Lower Band',
          data: lowerBand,
          borderColor: 'rgba(153, 102, 255, 0.8)',
          type: 'line',
          yAxisID: 'y-axis-price',
          tension: 0.3,
          borderDash: [5, 5],
        },
        {
          label: 'Bollinger Signal',
          data: bollingerSignal,
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgba(255, 159, 64, 1)',
          type: 'bar',
          yAxisID: 'y-axis-signal',
        },
        {
          label: 'Accumulation Distribution Line (ADL)',
          data: accumulationDistributionLine,
          borderColor: 'rgba(255, 206, 86, 0.8)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          type: 'line',
          yAxisID: 'y-axis-adl',
          tension: 0.3, // Smooth line
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Price, Volume, Bollinger Bands, and Accumulation Distribution Line',
          font: {
            size: 18,
          },
          color: '#333',
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#333',
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        'y-axis-price': {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Price',
            color: '#333',
            font: {
              size: 14,
            },
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.3)',
          },
          ticks: {
            color: '#333',
          },
        },
        'y-axis-volume': {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Volume',
            color: '#333',
            font: {
              size: 14,
            },
          },
          grid: {
            drawOnChartArea: false, // Avoid grid line overlap
          },
          ticks: {
            color: '#333',
          },
        },
        'y-axis-adl': {
          type: 'linear',
          position: 'right',
          display: true,
          title: {
            display: true,
            text: 'ADL',
            color: '#333',
            font: {
              size: 14,
            },
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: '#333',
          },
        },
        'y-axis-signal': {
          type: 'linear',
          position: 'right',
          display: false, // Hide if not needed, use when necessary
        },
        x: {
          grid: {
            color: 'rgba(200, 200, 200, 0.3)',
          },
          ticks: {
            color: '#333',
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 20,
          bottom: 20,
        },
      },
    },
  };

  // Render chart and return as image buffer
  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

// In your route
