import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';
const path = require('path');
const xlsx = require('xlsx');


// Set up ChartJS canvas for Williams %R
const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Function to read last 14 lines for Williams %R data
export const readLast14LinesForWilliamsR = () => {
  const filePath = path.join(__dirname, '../data/data.xlsx');
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet['!ref']) throw new Error("Sheet reference ('!ref') is undefined.");

  const range = xlsx.utils.decode_range(sheet['!ref']);
  const totalRows = range.e.r + 1;

  const stockDates: string[] = [];
  const closePrices: number[] = [];
  const volumes: number[] = [];
  const williamsRValues: number[] = [];

  const startRow = Math.max(2, totalRows - 13);

  for (let i = startRow; i <= totalRows; i++) {
    const dateCell = sheet[`B${i}`];
    const closePriceCell = sheet[`C${i}`];
    const volumeCell = sheet[`D${i}`];
    const williamsRCell = sheet[`AO${i}`];

    if (dateCell && closePriceCell && volumeCell && williamsRCell) {
      stockDates.push(dateCell.v);
      closePrices.push(parseFloat(closePriceCell.v));
      volumes.push(parseFloat(volumeCell.v));
      williamsRValues.push(parseFloat(williamsRCell.v));
    }
  }

  return { stockDates, closePrices, volumes, williamsRValues };
};

// Function to generate Williams %R chart
export const generateWilliamsRChart = async (dates: string[], prices: number[], volumes: number[], williamsR: number[]) => {
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
          label: 'Williams %R',
          data: williamsR,
          borderColor: 'red',
          yAxisID: 'y3',
          fill: false,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      scales: {
        y1: { type: 'linear', position: 'left', title: { display: true, text: 'Price' } },
        y2: { type: 'linear', position: 'right', title: { display: true, text: 'Volume' }, grid: { drawOnChartArea: false } },
        y3: { type: 'linear', position: 'left', title: { display: true, text: 'Williams %R' }, min: -100, max: 0 },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
};
