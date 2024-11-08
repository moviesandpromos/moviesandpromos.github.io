import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

import { ChartConfiguration } from 'chart.js';

const path = require('path');
const xlsx = require('xlsx');

// Set up ChartJS canvas for RSI
const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });


export const readDataForMACDChart = () => {
//export function readDataForMACDChart() {
  const filePath = '../data/data.xlsx'; // Path to your Excel file
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const worksheet = workbook.Sheets[sheetName];

  // Read data from columns
  const stockDates = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[1]); // Column B for Date
  const closePrices = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[2]); // Column C for Close Price
  const volumes = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[3]); // Column D for Volume
  const macd = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[4]); // Column E for MACD
  const signalLine = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[5]); // Column F for Signal Line
  const histogram = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[6]); // Column G for Histogram

  return {
    stockDates: stockDates.slice(1), // Removing the header
    closePrices: closePrices.slice(1),
    volumes: volumes.slice(1),
    macd: macd.slice(1),
    signalLine: signalLine.slice(1),
    histogram: histogram.slice(1),
  };
}

// Function to generate MACD chart
export const generateMACDChart = async (stockDates: string[], closePrices: number[], volumes: number[], macd: number[], signalLine: number[], histogram: number[]) => {
    const configuration: ChartConfiguration<'line' | 'bar'> = {
//    const configuration = {
        type: 'bar', // 'bar' for volume, 'line' for price and MACD
        data: {
          labels: stockDates, // X-axis (dates)
          datasets: [
            {
              label: 'Price',
              data: closePrices,
              borderColor: 'blue',
              type: 'line',
              yAxisID: 'y-axis-price',
            },
            {
              label: 'Volume',
              data: volumes,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              yAxisID: 'y-axis-volume',
            },
            {
              label: 'MACD',
              data: macd,
              borderColor: 'green',
              type: 'line',
              yAxisID: 'y-axis-macd',
            },
            {
              label: 'Signal Line',
              data: signalLine,
              borderColor: 'red',
              type: 'line',
              yAxisID: 'y-axis-macd',
            },
            {
              label: 'Histogram',
              data: histogram,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              type: 'bar',
              yAxisID: 'y-axis-macd',
            },
          ],
        },
        options: {
          scales: {
            'y-axis-price': {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Price',
              },
            },
            'y-axis-volume': {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Volume',
              },
              grid: {
                drawOnChartArea: false,
              },
            },
            'y-axis-macd': {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'MACD',
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      };
    
      // Render chart and return as image buffer
      return await chartJSNodeCanvas.renderToBuffer(configuration);
    };
