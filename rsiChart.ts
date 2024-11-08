import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

import { ChartConfiguration } from 'chart.js';

const path = require('path');
const xlsx = require('xlsx');

// Set up ChartJS canvas for RSI
const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Function to read last 14 lines for RSI data
export const readLast14LinesForRSI = () => {
  const filePath = path.join(__dirname, '../data/data.xlsx');
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet['!ref']) throw new Error("Sheet reference ('!ref') is undefined.");

  const range = xlsx.utils.decode_range(sheet['!ref']);
  const totalRows = range.e.r + 1;

  const stockDates: string[] = [];
  const closePrices: number[] = [];
  const volumes: number[] = [];
  const rsiValues: number[] = [];

  const startRow = Math.max(2, totalRows - 13);

  for (let i = startRow; i <= totalRows; i++) {
    const dateCell = sheet[`B${i}`];
    const closePriceCell = sheet[`C${i}`];
    const volumeCell = sheet[`D${i}`];
    const rsiCell = sheet[`K${i}`];

    if (dateCell && closePriceCell && volumeCell && rsiCell) {
      stockDates.push(dateCell.v);
      closePrices.push(parseFloat(closePriceCell.v));
      volumes.push(parseFloat(volumeCell.v));
      rsiValues.push(parseFloat(rsiCell.v));
    }
  }

  return { stockDates, closePrices, volumes, rsiValues };
};

// Function to generate RSI chart
export const generateRSIChart = async (dates: string[], prices: number[], volumes: number[], rsi: number[]) => {
  const configuration: ChartConfiguration<'line' | 'bar'> = {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [
        {
          type: 'line',
          label: 'Close Price',
          data: prices,
          borderColor: 'blue',
          yAxisID: 'y1',
          fill: false,
        },
        {
          type: 'bar',
          label: 'Volume',
          data: volumes,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          yAxisID: 'y2',
        },
        {
          type: 'line',
          label: 'RSI',
          data: rsi,
          borderColor: 'green',
          yAxisID: 'y3',
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y1: { type: 'linear', position: 'left', title: { display: true, text: 'Price' } },
        y2: { type: 'linear', position: 'right', title: { display: true, text: 'Volume' }, grid: { drawOnChartArea: false } },
        y3: { type: 'linear', position: 'right', title: { display: true, text: 'RSI' }, min: 0, max: 100 },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
};
