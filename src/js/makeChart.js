import Plotly from 'plotly.js-dist-min';
import { getData } from './handleData';
import { getOrder } from './handleOrder';
import { getCheckList } from './sortList'
import { customPalette as palette} from './palette'

export class MyChart {
  mode = document.getElementById('mode');
  xAxis = document.getElementById('x-axis');
  xMin = document.getElementById('x-axis-min');
  xMax = document.getElementById('x-axis-max');
  yAxis = document.getElementById('y-axis');
  yMin = document.getElementById('y-axis-min');
  yMax = document.getElementById('y-axis-max');
  yAxis2 = document.getElementById('y-axis2');
  y2Min = document.getElementById('y-axis2-min');
  y2Max = document.getElementById('y-axis2-max');
  legend = document.getElementById('legend');
  legendDirection = document.getElementById('legend-direction');
  LAYOUT = {
    autosize: true,
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
      anchor: 'y2',
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
      domain: [0.5, 1],
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
    yaxis2: {
      domain: [0, 0.5],
      range: [null, null],
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

  constructor({ chartId }) {
    this.MYCHART = document.getElementById(chartId);
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
      this.y2Min.value = this.LAYOUT.yaxis2.range[0];
      this.y2Max.value = this.LAYOUT.yaxis2.range[1];
    }, 200);

    this.MYCHART.on('plotly_autosize', () => {
      setTimeout(() => {
      this.xMin.value = this.LAYOUT.xaxis.range[0];
      this.xMax.value = this.LAYOUT.xaxis.range[1];
      this.yMin.value = this.LAYOUT.yaxis.range[0];
      this.yMax.value = this.LAYOUT.yaxis.range[1];
      this.y2Min.value = this.LAYOUT.yaxis2.range[0];
      this.y2Max.value = this.LAYOUT.yaxis2.range[1];
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
      'yaxis2.title.text': this.yAxis2.value,
    })
  }

  getChartData() {
    const chartData = [];
    const data = getData();
    const order = getOrder();
    const checkList = getCheckList();
    order.forEach((file, i) => {
      chartData.push({
        type: 'scattergl',
        name: file,
        legendgroup: file,
        visible: checkList[i],
        x: data[file][this.xAxis.value],
        y: data[file][this.yAxis.value],
        mode: this.mode.value,
        marker: {
          size: 9,
          color: palette[data[file].colorIndex],
          symbol: i,
        }
      });
      chartData.push({
        type: 'scattergl',
        name: file,
        legendgroup: file,
        showlegend: false,
        visible: checkList[i],
        x: data[file][this.xAxis.value],
        y: data[file][this.yAxis2.value],
        yaxis: 'y2',
        mode: this.mode.value,
        marker: {
          size: 9,
          color: palette[data[file].colorIndex],
          symbol: i,
        }
      });
    });
    return chartData;
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
    if (this.yAxis2.value === '時刻') {
      this.LAYOUT.yaxis2.type = 'date';
    } else {
      this.LAYOUT.yaxis2.type = '-';
    }
    Plotly.react(
      this.MYCHART, 
      chartData,
      this.LAYOUT,
      this.CONFIG
    );
  };

}
