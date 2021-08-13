import 'bootstrap/js/dist/toast';
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/button';
import './../sass/_custom.scss';
import 'jpn.css/dist/bootstrap/jpn.min.css'

import { dropHandler, fileChangeHandler }from './handleFiles';
import { readHtmlHandler, resetDataHandler } from './saveHtml';
import { MyChart } from './makeChart';
import { initList } from './sortList';
import { setHeadersToAxis } from './handleHeaders';
import {
  changeModeHandler,
  inputXMinHandler,
  inputXMaxHandler,
  inputYMinHandler,
  inputYMaxHandler,
  changeLegendHandler,
  changeLegendDirectionHandler,
  toggleAllCheckedHandler,
} from './formEvent';

const spinner = document.getElementById('loading');
spinner.classList.remove('loaded');

window.onload = () => {
  spinner.classList.add('loaded');

  const chartDiv = document.getElementById('chart');
  const chartDiv2 = document.getElementById('chart2');
  if (chartDiv.hasChildNodes()) {
    const listUl = document.getElementById('sort-list');
    const cloneChart = chartDiv.cloneNode(false);
    const cloneChart2 = chartDiv2.cloneNode(false);
    const cloneList = listUl.cloneNode(false);
    chartDiv.parentNode.replaceChild(cloneChart, chartDiv);
    chartDiv2.parentNode.replaceChild(cloneChart2, chartDiv2);
    listUl.parentNode.replaceChild(cloneList, listUl);
  }

  setHeadersToAxis(
    document.getElementById('x-axis').value,
    document.getElementById('y-axis').value,
    document.getElementById('y-axis2').value
  );
  setHeadersToAxis(
    '経過時間(min)',
    '速度(km/h)',
    'ケイデンス(rpm)'
  );
  initList();
  const chart = new MyChart({
    chartId: 'chart',
    yAxis: 'y-axis',
    yAxisMin: 'y-axis-min',
    yAxisMax: 'y-axis-max'
  });
  const chart2 = new MyChart({
    chartId: 'chart2',
    yAxis: 'y-axis2',
    yAxisMin: 'y-axis2-min',
    yAxisMax: 'y-axis2-max'
  });
  const charts = [chart, chart2];

  document.getElementById('mode').addEventListener('change', 
    {charts: charts, handleEvent: changeModeHandler}, false
  );
  document.getElementById('x-axis-min').addEventListener('input', 
    {charts: charts, handleEvent: inputXMinHandler}, false
  );
  document.getElementById('x-axis-max').addEventListener('input', 
    {charts: charts, handleEvent: inputXMaxHandler}, false
  );
  document.getElementById('y-axis-min').addEventListener('input', 
    {charts: charts, handleEvent: inputYMinHandler}, false
  );
  document.getElementById('y-axis-max').addEventListener('input', 
    {charts: charts, handleEvent: inputYMaxHandler}, false
  );
  document.getElementById('y-axis2-min').addEventListener('input', 
    {charts: charts, handleEvent: inputYMinHandler}, false
  );
  document.getElementById('y-axis2-max').addEventListener('input', 
    {charts: charts, handleEvent: inputYMaxHandler}, false
  );
  document.getElementById('legend').addEventListener('change', 
    {chart: chart, handleEvent: changeLegendHandler}, false
  );
  document.getElementById('legend-direction').addEventListener('change', 
    {chart: chart, handleEvent: changeLegendDirectionHandler}, false
  );
  document.getElementById('x-axis').addEventListener('change', 
    {charts: charts, handleEvent: function() {
      this.charts.forEach(chart => {
        chart.updateChart();
        chart.setAxisName();
      })
    }}, false
  );
  document.getElementById('y-axis').addEventListener('change', 
    {charts: charts, handleEvent: function() {
      this.charts.forEach(chart => {
        chart.updateChart();
        chart.setAxisName();
      })
    }}, false
  );
  document.getElementById('y-axis2').addEventListener('change', 
    {charts: charts, handleEvent: function() {
      this.charts.forEach(chart => {
        chart.updateChart();
        chart.setAxisName();
      })
    }}, false
  );
  document.getElementById('text-area').addEventListener('input', (e) => {
    e.currentTarget.innerText = e.currentTarget.value;
  }, false);

  document.getElementById('read').addEventListener('change',
    {charts: charts, handleEvent: readHtmlHandler}, false
  );
  document.getElementById('save').addEventListener('click', (e) => {
    const type = document.getElementById('mode');
    type.options[type.selectedIndex].setAttribute('selected', 'selected');
    const xAxis = document.getElementById('x-axis');
    xAxis.options[xAxis.selectedIndex].setAttribute('selected', 'selected');
    const yAxis = document.getElementById('y-axis');
    yAxis.options[yAxis.selectedIndex].setAttribute('selected', 'selected');
    const yAxis2 = document.getElementById('y-axis2');
    yAxis2.options[yAxis2.selectedIndex].setAttribute('selected', 'selected');

    let docOuterHtml = document.documentElement.outerHTML;
    docOuterHtml = docOuterHtml.replace(/loader-wrapper loaded/, 'loader-wrapper');
    e.currentTarget.href = URL.createObjectURL(new Blob([docOuterHtml]));
  }, false); 

  document.getElementById('reset').addEventListener('click',
    {charts: charts, handleEvent: resetDataHandler}, false
  );

  const dropZone = document.getElementById('drop-zone');
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
  }, false);
  dropZone.addEventListener('drop',
    {charts: charts, handleEvent: dropHandler}, false
  );

  document.getElementById('select-files').addEventListener('change',
    {charts: charts, handleEvent: fileChangeHandler}, false
  );

  document.getElementById('all-checked').addEventListener('change',
    {charts: charts, handleEvent: toggleAllCheckedHandler}, false
  );

}

