export const getHeaders = () => {
  return JSON.parse(document.getElementById('chart-headers').textContent);
}

export const changeHeaders = newHeaders => {
  document.getElementById('chart-headers').textContent = JSON.stringify(newHeaders);
};

export const concatHeaders = (headersA, headersB) => {
  const newHeaders = headersA.concat(headersB)
  document.getElementById('chart-headers').textContent = JSON.stringify([...new Set(newHeaders)]);
};

export const setHeadersToAxis = (xSelected='', ySelected='') => {
  const xAxis = document.getElementById('x-axis');
  const yAxis = document.getElementById('y-axis');

  while (xAxis.firstChild) {
    xAxis.removeChild(xAxis.firstChild);
  }
  while (yAxis.firstChild) {
    yAxis.removeChild(yAxis.firstChild);
  }

  const headers = getHeaders();
  headers.forEach(header => {
    const option = document.createElement('option');
    option.value = header;
    option.textContent = header;
    if (header === xSelected) {
      option.selected = true;
    }
    xAxis.appendChild(option);
  })
  headers.forEach(header => {
    const option = document.createElement('option');
    if (header === ySelected) {
      option.selected = true;
    }
    option.value = header;
    option.textContent = header;
    yAxis.appendChild(option);
  })
};
