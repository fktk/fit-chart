import { addData } from './handleData';
import { addOrder, getOrder } from './handleOrder';
import { getHeaders, changeHeaders, setHeadersToAxis } from './handleHeaders';
import { addList } from './sortList';
import { showToast } from './myComponents';
import { choiceColorIndex } from './palette';
import FitParser from 'fit-file-parser';

export function dropHandler(e) {
  e.preventDefault();

  let fileNumber = getOrder().length

  const files = e.dataTransfer.files;
  for (let i = 0, f; f = files[i]; i++) {
    handleFile(f, fileNumber, this.chart);
    fileNumber++;
  }
}

export function fileChangeHandler(e) {
  let fileNumber = getOrder().length;
  const files = e.target.files;
  for (let i = 0, f; f = files[i]; i++) {
    handleFile(f, fileNumber, this.chart);
    fileNumber++;
  }
  document.getElementById('select-files').value = '';
}

const handleFile = (file, fileNumber, chart) => {
  if (!/(fit|FIT)$/.test(file.name)) {
    showToast(`${file.name}はFITファイルではありません`)
    return;
  }

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    const fitParser = new FitParser({
      force: true,
      speedUnit: 'km/h',
      lengthUnit: 'm',
      elapsedRecordField: true,
    })
    const buffer = reader.result;
    fitParser.parse(buffer, (error, fitData) => {
      if (error) {
        console.log(error);
      } else {
        let data = {
          '経過時間(min)': [],
          '距離(km)': [],
          '時刻': [],
          '速度(km/h)': [],
          '高度(m)': [],
          'ケイデンス(rpm)': [],
          '心拍数(bpm)': [],
          'パワー(W)': [],
          '温度(℃)': [],
        };
        fitData.records.forEach(record => {
          data['経過時間(min)'].push(record['elapsed_time']/60);
          data['距離(km)'].push(record['distance']/1000);
          data['時刻'].push(
            record['timestamp'].getFullYear().toString() + '-' +
            record['timestamp'].getMonth().toString().padStart(2, '0') + '-' +
            record['timestamp'].getDay().toString().padStart(2, '0') + ' ' +
            record['timestamp'].getHours().toString().padStart(2, '0') + ':' +
            record['timestamp'].getMinutes().toString().padStart(2, '0') + ':' +
            record['timestamp'].getSeconds().toString().padStart(2, '0')
          );
          data['速度(km/h)'].push(record['speed']);
          data['高度(m)'].push(record['altitude']);
          data['ケイデンス(rpm)'].push(record['cadence']);
          data['心拍数(bpm)'].push(record['heart_rate']);
          data['パワー(W)'].push(record['power']);
          data['温度(℃)'].push(record['temperature']);
        })
        const timestamp = fitData.sessions[0].start_time;
        const Name = timestamp.getFullYear() + '年' +
          timestamp.getMonth() + '月' +
          timestamp.getDay() + '日' +
          timestamp.getHours() + '時' +
          timestamp.getMinutes() + '分';
        const xAxis = document.getElementById('x-axis').value
        const yAxis = document.getElementById('y-axis').value
        data.colorIndex = choiceColorIndex(fileNumber);
        const fileName = incrementWordIfOverlapping(Name, getOrder());
        addData({[fileName]: data});
        addOrder(fileName);
        addList(fileName);
        setHeadersToAxis(xAxis, yAxis);
        chart.addTrace(fileName);
      }
    })
  };
};

export const incrementWordIfOverlapping = (word, wordList) => {
  let i = 1
  let newWord = word;
  while (wordList.includes(newWord)) {
    newWord = newWord.replace(/($|_\d*$)/, `_${i}`);
    i++
  }
  return newWord;
};

