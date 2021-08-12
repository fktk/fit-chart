//sortListのリファクタリング
//save時の状態の保存
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
  if (chartDiv.hasChildNodes()) {
    const listUl = document.getElementById('sort-list');
    const cloneChart = chartDiv.cloneNode(false);
    const cloneList = listUl.cloneNode(false);
    chartDiv.parentNode.replaceChild(cloneChart, chartDiv);
    listUl.parentNode.replaceChild(cloneList, listUl);
  }

  setHeadersToAxis(
    document.getElementById('x-axis').value,
    document.getElementById('y-axis').value
  );
  setHeadersToAxis(
    '経過時間(min)',
    '速度(km/h)'
  );
  initList();
  const chart = new MyChart();

  document.getElementById('mode').addEventListener('change', 
    {chart: chart, handleEvent: changeModeHandler}, false
  );
  document.getElementById('x-axis-min').addEventListener('input', 
    {chart: chart, handleEvent: inputXMinHandler}, false
  );
  document.getElementById('x-axis-max').addEventListener('input', 
    {chart: chart, handleEvent: inputXMaxHandler}, false
  );
  document.getElementById('y-axis-min').addEventListener('input', 
    {chart: chart, handleEvent: inputYMinHandler}, false
  );
  document.getElementById('y-axis-max').addEventListener('input', 
    {chart: chart, handleEvent: inputYMaxHandler}, false
  );
  document.getElementById('legend').addEventListener('change', 
    {chart: chart, handleEvent: changeLegendHandler}, false
  );
  document.getElementById('legend-direction').addEventListener('change', 
    {chart: chart, handleEvent: changeLegendDirectionHandler}, false
  );
  document.getElementById('x-axis').addEventListener('change', 
    {chart: chart, handleEvent: function() {
      this.chart.updateChart();
      this.chart.setAxisName();
    }}, false
  );
  document.getElementById('y-axis').addEventListener('change', 
    {chart: chart, handleEvent: function() {
      this.chart.updateChart();
      this.chart.setAxisName();
    }}, false
  );
  document.getElementById('text-area').addEventListener('input', (e) => {
    e.currentTarget.innerText = e.currentTarget.value;
  }, false);

  document.getElementById('read').addEventListener('change',
    {chart: chart, handleEvent: readHtmlHandler}, false
  );
  document.getElementById('save').addEventListener('click', (e) => {
    const type = document.getElementById('mode');
    type.options[type.selectedIndex].setAttribute('selected', 'selected');
    const xAxis= document.getElementById('x-axis');
    xAxis.options[xAxis.selectedIndex].setAttribute('selected', 'selected');
    const yAxis= document.getElementById('y-axis');
    yAxis.options[yAxis.selectedIndex].setAttribute('selected', 'selected');

    let docOuterHtml = document.documentElement.outerHTML;
    docOuterHtml = docOuterHtml.replace(/loader-wrapper loaded/, 'loader-wrapper');
    e.currentTarget.href = URL.createObjectURL(new Blob([docOuterHtml]));
  }, false); 

  document.getElementById('reset').addEventListener('click',
    {chart: chart, handleEvent: resetDataHandler}, false
  );

  const dropZone = document.getElementById('drop-zone');
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
  }, false);
  dropZone.addEventListener('drop',
    {chart: chart, handleEvent: dropHandler}, false
  );

  document.getElementById('select-files').addEventListener('change',
    {chart: chart, handleEvent: fileChangeHandler}, false
  );

  document.getElementById('all-checked').addEventListener('change',
    {chart: chart, handleEvent: toggleAllCheckedHandler}, false
  );

}

