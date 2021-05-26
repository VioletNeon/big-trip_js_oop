import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import {getDuration} from '../utils/date.js';
import {makeItemsUniq} from '../utils/common.js';
import {getEmptyMap, getSortedDataLabels} from '../utils/stats.js';

const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, points, uniqTypes) => {
  const Money = getEmptyMap(uniqTypes);
  points.forEach((point) => {
    Money[point.type] = Money[point.type] + point.basePrice;
  });
  const [typeLabels, labelsData] = getSortedDataLabels(Money);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typeLabels,
      datasets: [{
        data: labelsData,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, points, uniqTypes) => {
  const CountType = getEmptyMap(uniqTypes);
  points.forEach((point) => {
    CountType[point.type] = CountType[point.type] + 1;
  });
  const [typeLabels, labelsData] = getSortedDataLabels(CountType);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typeLabels,
      datasets: [{
        data: labelsData,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpendChart = (timeCtx, points, uniqTypes) => {
  const TimeSpend = getEmptyMap(uniqTypes);
  points.forEach((point) => {
    TimeSpend[point.type] = TimeSpend[point.type] + dayjs(point.dateTo).diff(point.dateFrom, 'm');
  });
  const [typeLabels, labelsData] = getSortedDataLabels(TimeSpend);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typeLabels,
      datasets: [{
        data: labelsData,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getDuration(dayjs(), dayjs().add(val, 'minute'))}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class Statistics extends SmartView {
  constructor() {
    super();

    this._moneyCart = null;
    this._typeChart = null;
    this._timeSpendChart = null;
  }

  getTemplate() {
    return `<section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>
        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
        </div>
        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
        </div>
        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
        </div>
      </section>`;
  }

  removeElement() {
    super.removeElement();

    if (this._moneyCart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._moneyCart = null;
      this._typeChart = null;
      this._timeSpendChart = null;
    }
  }

  setCharts(points) {
    if (this._moneyCart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._moneyCart = null;
      this._typeChart = null;
      this._timeSpendChart = null;
    }

    this._points = points.slice();

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    const types = points.map((point) => point.type);
    const uniqTypes = makeItemsUniq(types);
    const barCount = uniqTypes.length;

    moneyCtx.height = BAR_HEIGHT * barCount;
    typeCtx.height = BAR_HEIGHT * barCount;
    timeCtx.height = BAR_HEIGHT * barCount;

    this._moneyCart = renderMoneyChart(moneyCtx, points, uniqTypes);
    this._typeChart = renderTypeChart(typeCtx, points, uniqTypes);
    this._timeSpendChart = renderTimeSpendChart(timeCtx, points, uniqTypes);
  }
}
