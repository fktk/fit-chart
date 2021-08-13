import Plotly from 'plotly.js-gl2d-dist';
import { getData } from './handleData';
import { getOrder } from './handleOrder';
import { getCheckList } from './sortList'
import { customPalette as palette} from './palette'

export class MyChart {
  mode = document.getElementById('mode');
  xAxis = document.getElementById('x-axis');
  xMin = document.getElementById('x-axis-min');
  xMax = document.getElementById('x-axis-max');
  legend = document.getElementById('legend');
  legendDirection = document.getElementById('legend-direction');
  LAYOUT = {
    autosize: true,
    height: 250,
    //title: 'Chart',
    modebar: {
      orientation: 'h',
    },
    font: {
      family: 'Roboto',
    },
    margin: {
      //l: 100,
      r: 10,
      t: 30,
      //b: 50,
    },
    showlegend: true,
    legend: {
      x: 0,
      xanchor: 'left',
      font: {
        size: 14,
      },
      orientation: 'v',
    },
    xaxis: {
      title: {
        text: 'x軸',
        font: {
          size: 16,
        },
      },
      tickfont: {
        size: 14,
      },
      exponentformat: 'none',
      type: '-',
    },
    yaxis: {
      title: {
        text: 'y軸',
        font: {
          size: 16,
        },
      },
      tickfont: {
        size: 14,
      },
      exponentformat: 'none',
      type: '-',
    },
  };

  CONFIG = {
    displayModeBar: true,
    displaylogo: false,
    responsive: true,
    editable: true,
    edits: {
      titleText: false,
      legendText: false,
    },
    modeBarButtonsToRemove: [
      'lasso2d',
      'select2d',
      'zoomIn2d',
      'resetScale2d',
    ],
    modeBarButtonsToAdd: [
      'toggleSpikelines',
      'hoverclosest',
      'hovercompare',
    ],
    toImageButtonOptions: {
      format: 'png',
      filename: 'fit-chart',
      height: 300,
      width: 400,
      scale: 2,
    },
    doubleClickDelay: 800,
  };

  constructor({
    chartId,
    yAxis,
    yAxisMin,
    yAxisMax,
  }) {
    this.MYCHART = document.getElementById(chartId);
    this.yAxis = document.getElementById(yAxis);
    this.yMin = document.getElementById(yAxisMin);
    this.yMax = document.getElementById(yAxisMax);
    const chartData = this.getChartData();
    Plotly.newPlot(
      this.MYCHART, 
      chartData,
      this.LAYOUT,
      this.CONFIG
    );
    this.setAxisName();

    setTimeout(() => {
      this.xMin.value = this.LAYOUT.xaxis.range[0];
      this.xMax.value = this.LAYOUT.xaxis.range[1];
      this.yMin.value = this.LAYOUT.yaxis.range[0];
      this.yMax.value = this.LAYOUT.yaxis.range[1];
    }, 200);

    this.MYCHART.on('plotly_autosize', () => {
      setTimeout(() => {
      this.xMin.value = this.LAYOUT.xaxis.range[0];
      this.xMax.value = this.LAYOUT.xaxis.range[1];
      this.yMin.value = this.LAYOUT.yaxis.range[0];
      this.yMax.value = this.LAYOUT.yaxis.range[1];
      }, 200);
    });

    this.MYCHART.on('plotly_legendclick', () => {
      return false;
    });
  };

  setAxisName() {
    Plotly.relayout(this.MYCHART, {
      'xaxis.title.text': this.xAxis.value,
      'yaxis.title.text': this.yAxis.value,
    })
  }

  addTrace(fileName) {
    const data = getData();
    const symbol = Object.keys(data).length + 1;

    Plotly.addTraces(this.MYCHART, {
      type: 'scattergl',
      name: fileName,
      visible: true,
      x: data[fileName][this.xAxis.value],
      y: data[fileName][this.yAxis.value],
      mode: this.mode.value,
      marker: {
        size: 9,
        color: palette[data[fileName].colorIndex],
        symbol: symbol,
      }
    });
    this.xMin.value = this.LAYOUT.xaxis.range[0];
    this.xMax.value = this.LAYOUT.xaxis.range[1];
    this.yMin.value = this.LAYOUT.yaxis.range[0];
    this.yMax.value = this.LAYOUT.yaxis.range[1];
  };

  getChartData() {
    const data = getData();
    const order = getOrder();
    const checkList = getCheckList();
    return order.map((file, i) => {
      return {
        type: 'scattergl',
        name: file,
        visible: checkList[i],
        x: data[file][this.xAxis.value],
        y: data[file][this.yAxis.value],
        mode: this.mode.value,
        marker: {
          size: 9,
          color: palette[data[file].colorIndex],
          symbol: i,
        }
      };
    });
  };

  updateChart() {
    const chartData = this.getChartData();
    if (this.xAxis.value === '時刻') {
      this.LAYOUT.xaxis.type = 'date';
    } else {
      this.LAYOUT.xaxis.type = '-';
    }
    if (this.yAxis.value === '時刻') {
      this.LAYOUT.yaxis.type = 'date';
    } else {
      this.LAYOUT.yaxis.type = '-';
    }
    Plotly.react(
      this.MYCHART, 
      chartData,
      this.LAYOUT,
      this.CONFIG
    );
  };

}
