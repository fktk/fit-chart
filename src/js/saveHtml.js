import { addData } from './handleData';
import { addOrder, getOrder, changeOrder } from './handleOrder';
import { getHeaders, concatHeaders, changeHeaders, setHeadersToAxis } from './handleHeaders';
import { addList, removeAllList } from './sortList';
import { incrementWordIfOverlapping } from './handleFiles';

export function readHtmlHandler(e) {
  const file = e.target.files[0];
  readHtmlAndUpdataData(file, this.chart);
  document.getElementById('read').value = '';
}

const readHtmlAndUpdataData = (file, chart) => {
  if (!/(html)$/.test(file.name)) {
    showToast(`${file.name}はhtmlファイルではありません`)
    return;
  }
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => {
    const xAxisValue = document.getElementById('x-axis').value;
    const yAxisValue = document.getElementById('y-axis').value;
    const text = reader.result;
    const {data, order, headerSet} = extractDataFromHtmlText(text);
    concatHeaders(getHeaders(), headerSet);

    order.forEach((fileName) => {
      const newFileName = incrementWordIfOverlapping(fileName, getOrder());
      addData({[newFileName]: data[fileName]});
      addOrder(newFileName);
      addList(newFileName);
      setHeadersToAxis(xAxisValue, yAxisValue);
      chart.addTrace(newFileName);
    });
  };
};

const extractDataFromHtmlText = text => {
  const docEl = new DOMParser().parseFromString(text, 'text/html');
  const data = JSON.parse(docEl.getElementById('chart-data').textContent);
  const order = JSON.parse(docEl.getElementById('chart-order').textContent);
  const headerSet = JSON.parse(docEl.getElementById('chart-headers').textContent);
  return {data, order, headerSet}
}

export function resetDataHandler() {
  document.getElementById('chart-data').textContent = JSON.stringify({});
  changeOrder([]);
  removeAllList();

  this.chart.xMin.value='';
  this.chart.xMax.value='';
  this.chart.yMin.value='';
  this.chart.yMax.value='';
  
  document.getElementById('text-area').value = '';
  document.getElementById('text-area').innerText = '';
  
  this.chart.updateChart();

};

