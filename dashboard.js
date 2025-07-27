// 模擬家電狀態資料
const appliances = [
  { name: '冷氣', status: true, power: 1200 },
  { name: '燈', status: false, power: 60 },
  { name: '電視', status: true, power: 200 },
  { name: '冰箱', status: true, power: 180 },
  { name: '洗衣機', status: false, power: 500 },
];

// 模擬用電量資料
const weekData = {
  categories: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
  data: [12.5, 13.2, 15.1, 14.8, 16.0, 18.2, 17.5], // kWh
};
const monthData = {
  categories: Array.from({length: 30}, (_, i) => `${i+1}日`),
  data: Array.from({length: 30}, () => (12 + Math.random() * 8).toFixed(1)),
};

// 模擬一天中每小時用電量
const hourlyData = [
  0.5, 0.4, 0.3, 0.3, 0.4, 0.6, 1.2, 2.0, 2.5, 2.8, 2.6, 2.2,
  2.0, 2.1, 2.3, 2.7, 3.0, 3.2, 2.8, 2.0, 1.5, 1.0, 0.8, 0.6
];

// 渲染家電狀態
function renderApplianceStatus() {
  const list = document.getElementById('appliance-list');
  list.innerHTML = '';
  appliances.forEach(appliance => {
    const item = document.createElement('div');
    item.className = 'appliance-item';
    item.innerHTML = `
      <span class="appliance-name">${appliance.name}</span>
      <span>
        <span class="status-indicator ${appliance.status ? 'status-on' : 'status-off'}"></span>
        <span>${appliance.status ? '開啟' : '關閉'}</span>
      </span>
    `;
    list.appendChild(item);
  });
}

// 用電量圖表
let currentChart = 'week';
function renderEnergyChart() {
  const data = currentChart === 'week' ? weekData : monthData;
  Highcharts.chart('energy-chart', {
    chart: {
      type: 'column',
      backgroundColor: '#181c24',
      style: { fontFamily: 'Segoe UI, Noto Sans TC, Arial, sans-serif' }
    },
    title: { text: '' },
    xAxis: {
      categories: data.categories,
      labels: { style: { color: '#b0b8c1' } }
    },
    yAxis: {
      min: 0,
      title: { text: '用電量 (kWh)', style: { color: '#b0b8c1' } },
      labels: { style: { color: '#b0b8c1' } },
      gridLineColor: '#232837'
    },
    series: [{
      name: '用電量',
      data: data.data.map(Number),
      color: '#7ecfff',
      borderRadius: 4
    }],
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      backgroundColor: '#232837',
      style: { color: '#fff' },
      valueSuffix: ' kWh'
    }
  });
}

// 切換按鈕事件
function setupToggleButtons() {
  document.getElementById('week-btn').onclick = function() {
    currentChart = 'week';
    this.classList.add('active');
    document.getElementById('month-btn').classList.remove('active');
    renderEnergyChart();
  };
  document.getElementById('month-btn').onclick = function() {
    currentChart = 'month';
    this.classList.add('active');
    document.getElementById('week-btn').classList.remove('active');
    renderEnergyChart();
  };
}

// 一天中最高用電時段
function renderPeakTime() {
  const max = Math.max(...hourlyData);
  const hour = hourlyData.indexOf(max);
  const nextHour = (hour + 1) % 24;
  document.getElementById('peak-time').textContent = `${hour}:00 - ${nextHour}:00 (${max} kWh)`;
}

// 目前耗電量最高的家電
function renderTopAppliance() {
  const onAppliances = appliances.filter(a => a.status);
  if (onAppliances.length === 0) {
    document.getElementById('top-appliance').textContent = '無家電開啟';
    return;
  }
  const top = onAppliances.reduce((a, b) => a.power > b.power ? a : b);
  document.getElementById('top-appliance').textContent = `${top.name} (${top.power} W)`;
}

// 初始化
window.onload = function() {
  renderApplianceStatus();
  renderEnergyChart();
  setupToggleButtons();
  renderPeakTime();
  renderTopAppliance();
}; 