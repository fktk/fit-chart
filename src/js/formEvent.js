import Plotly from 'plotly.js-gl2d-dist';

export function changeModeHandler() {
  this.charts.forEach(chart => {
    Plotly.update(
      chart.MYCHART,
      {'mode': chart.mode.value},
      {
        'xaxis.range': [chart.xMin.value, chart.xMax.value],
        'yaxis.range': [chart.yMin.value, chart.yMax.value]
      }
    );
  })
}

export function inputXMinHandler() {
  this.charts.forEach(chart => {
    Plotly.relayout(chart.MYCHART, {'xaxis.range[0]': chart.xMin.value});
  })
}

export function inputXMaxHandler() {
  this.charts.forEach(chart => {
    Plotly.relayout(chart.MYCHART, {'xaxis.range[1]': chart.xMax.value});
  })
}

export function inputYMinHandler() {
  this.charts.forEach(chart => {
    Plotly.relayout(chart.MYCHART, {'yaxis.range[0]': chart.yMin.value});
  })
}

export function inputYMaxHandler() {
  this.charts.forEach(chart => {
    Plotly.relayout(chart.MYCHART, {'yaxis.range[1]': chart.yMax.value});
  })
}

export function changeLegendHandler() {
  Plotly.relayout(this.chart.MYCHART, {'showlegend': chart.legend.checked});
}

export function changeLegendDirectionHandler() {
  switch (this.chart.legendDirection.value) {
    case 'horizontal':
      Plotly.relayout(this.chart.MYCHART, {
        'legend.orientation': 'h'
      });
      break;
    case 'vertical':
      Plotly.relayout(this.chart.MYCHART, {
        'legend.orientation': 'v'
      });
      break;
  }
}

export function toggleAllCheckedHandler() {
  this.charts.forEach(chart => {
    if (document.getElementById('all-checked').checked) {
      const sortListContainer = document.getElementById('sort-list');
      Array.from(sortListContainer.childNodes).forEach(liEl => {
        liEl.getElementsByTagName('input')[0].checked = true;
      });
      chart.updateChart();
    } else {
      const sortListContainer = document.getElementById('sort-list');
      Array.from(sortListContainer.childNodes).forEach(liEl => {
        liEl.getElementsByTagName('input')[0].checked = false;
      });
      chart.updateChart();
    }
  })

}
