import * as xlsx from 'xlsx';


export const readDataForBollingerChart = () => { 
//function readDataForBollingerChart() {
  const filePath = '../data/data.xlsx'; // Path to your Excel file
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const worksheet = workbook.Sheets[sheetName];

  // Read data from columns
  const stockDates = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[1]); // Column B for Date
  const closePrices = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[2]); // Column C for Close Price
  const volumes = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[3]); // Column D for Volume
  const upperBand = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[16]); // Column Q for Upper Band
  const middleBand = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[17]); // Column R for Middle Band
  const lowerBand = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[18]); // Column S for Lower Band
  const bollingerSignal = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[19]); // Column T for Bollinger Signal

  return {
    stockDates: stockDates.slice(1), // Removing the header
    closePrices: closePrices.slice(1),
    volumes: volumes.slice(1),
    upperBand: upperBand.slice(1),
    middleBand: middleBand.slice(1),
    lowerBand: lowerBand.slice(1),
    bollingerSignal: bollingerSignal.slice(1),
  };
}


import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

const width = 800; // Chart width in pixels
const height = 600; // Chart height in pixels
const chartCallback = (ChartJS: any) => {
  // Global settings for Chart.js can go here
};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

//export const generateMACDChart = async (stockDates: string[], closePrices: number[], volumes: number[], macd: number[], signalLine: number[], histogram: number[]) => {

export const generateBollingerChart = async(stockDates: string[], closePrices: number[], volumes: number[], upperBand: number[], middleBand: number[], lowerBand: number[], bollingerSignal: number[]) =>{
const configuration: ChartConfiguration<'line' | 'bar'> = {
  
    type: 'bar', // Bar chart for volume, line chart for prices and Bollinger Bands
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
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Stock Prices with Volume and Bollinger Bands',
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
  