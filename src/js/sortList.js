import Sortable from 'sortablejs/modular/sortable.core.esm.js';
import EightBitColorPicker from 'eight-bit-color-picker/lib/eight-bit-color-picker.js';
import Plotly from 'plotly.js-dist-min'

import { 
  getData,
  changeFileNameInData,
  deleteData,
  getColorIndex, 
  changeColorIndex 
} from './handleData';

import {
  changeFileNameInOrder, 
  getOrder, 
  changeOrder,
  deleteOrder 
} from './handleOrder';

import 'eight-bit-color-picker/lib/eight-bit-color-picker.css';
import { customPalette as palette} from './palette'

export const initList = () => {
  const sortListContainer = document.getElementById('sort-list');
  new Sortable(sortListContainer, {
    animation: 150,
    invertSwap: true,
    onEnd: dragEnd,
    ghostClass: 'ghost',
  });

  const fileList = getOrder();
  fileList.forEach(fileName => {
    sortListContainer.appendChild(
      makeItemElement(fileName)
    );
  });
}

const dragEnd = e => {
  const CHART = document.getElementById('chart');
  const order = getOrder();
  const item = order.splice(e.oldIndex, 1)[0];
  order.splice(e.newIndex, 0, item);
  changeOrder(order);
  Plotly.moveTraces(CHART, [e.oldIndex*2, e.oldIndex*2+1], [e.newIndex*2, e.newIndex*2+1]);
}

const makeItemElement = (fileName, chart) => {
  const li = document.createElement('li');
  li.className = 'sort-item list-group-item p-1 d-flex align-items-center';
  li.style = 'cursor: move;'

  const checkColor = document.createElement('div');
  checkColor.className = 'd-flex align-items-center'
  const checkbox = document.createElement('input');
  checkbox.className = 'form-check-input my-1';
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.addEventListener('click', checkboxClick, false);
  
  const colorPicker = document.createElement('div');
  colorPicker.className = 'mx-1';

  const picker = new EightBitColorPicker({
    el: colorPicker,
    palette: palette,
    color: String(getColorIndex(fileName)),
  });
  picker.addEventListener('colorChange', changeColor, false);

  const nameSpan = document.createElement('span');
  nameSpan.className = 'text-truncate';
  nameSpan.textContent = fileName;

  const nameInput = document.createElement('input');
  nameInput.className = 'form-control form-control-sm d-none';
  nameInput.style = 'height: 1rem; padding: 2px; width: 100%;';
  nameInput.value = fileName;

  nameInput.addEventListener('change', {chart: chart, nameSpan: nameSpan, handleEvent: nameInputChange}, false);
  nameInput.addEventListener('blur', () => {
    nameInput.classList.add(['d-none']);
    nameSpan.classList.remove(['d-none']);
  },false)

  const editClose = document.createElement('div');
  editClose.className = 'ms-auto d-flex align-items-center'
  const editButton = document.createElement('button');
  editButton.className = 'btn btn-link p-0 me-1'
  editButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
  </svg>`;
  editButton.addEventListener('click', () => {
    const fileName = nameSpan.textContent;
    nameInput.classList.remove(['d-none']);
    nameSpan.classList.add(['d-none']);
    nameInput.value = fileName;
    nameInput.focus();
  })

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.style = `
      width: 0.2rem;
      height: 0.2rem;
      margin: 0 0.1rem;
    `;
  closeButton.addEventListener('click', {chart: chart, handleEvent: closeButtonClick} , false);

  checkColor.appendChild(checkbox);
  checkColor.appendChild(colorPicker);

  editClose.appendChild(editButton);
  editClose.appendChild(closeButton);

  li.appendChild(checkColor);
  li.appendChild(nameSpan);
  li.appendChild(nameInput);
  li.appendChild(editClose);
  return li;
}

function nameInputChange(e) {
  console.log(e)
  const oldName = this.nameSpan.textContent;
  const newName = e.target.value;
  e.target.classList.add(['d-none']);
  this.nameSpan.classList.remove(['d-none']);
  if (Object.keys(getData()).includes(newName)) { return; }
  if (newName === '') { return; }
  changeFileNameInData(oldName, newName);
  changeFileNameInOrder(oldName, newName);
  this.nameSpan.textContent = newName;
  this.chart.updateChart();
}

function closeButtonClick(e) {
  const liEl = e.target.parentElement.parentElement;
  const fileName = liEl.getElementsByTagName('span')[0].textContent;
  liEl.remove();
  deleteData(fileName);
  deleteOrder(fileName);
  this.chart.updateChart();
}

const changeColor = e => {
  const fileName = e.target.parentElement.parentElement.getElementsByTagName('span')[0].textContent;
  const index = getOrder().indexOf(fileName);
  changeColorIndex(fileName, e.detail.newColor);
  const CHART = document.getElementById('chart');
  Plotly.restyle(CHART, {'marker.color': palette[e.detail.newColor]}, [index*2, index*2+1]);
  Plotly.update(CHART, {}, {});
}

const checkboxClick = e => {
  const fileName = e.target.parentElement.parentElement.getElementsByTagName('span')[0].textContent;
  const order = getOrder();
  const index = order.indexOf(fileName);
  const CHART = document.getElementById('chart');
  Plotly.restyle(CHART, {visible: e.target.checked}, [index*2, index*2+1])
  Plotly.update(CHART, {}, {});
}

export const addList = (fileName, chart) => {
  const sortListContainer = document.getElementById('sort-list');
  sortListContainer.appendChild(makeItemElement(fileName, chart));
}
export const removeAllList = () => {
  const sortListContainer = document.getElementById('sort-list');
  while (sortListContainer.firstChild) {
    sortListContainer.removeChild(sortListContainer.firstChild);
  }
}

export const getCheckList = () => {
  const sortListContainer = document.getElementById('sort-list');
  return Array.from(sortListContainer.childNodes).map(liEl => {
    return liEl.getElementsByTagName('input')[0].checked;
  });
}
