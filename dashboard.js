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
  const chart = document.getElementById('energy-chart');
  chart.innerHTML = '';
  // 計算最大值，轉百分比
  const max = Math.max(...data.data.map(Number));
  const barCount = data.categories.length;
  chart.className = 'custom-bar-chart';
  for (let i = 0; i < barCount; i++) {
    const value = Number(data.data[i]);
    const percent = Math.round((value / max) * 100);
    const bar = document.createElement('div');
    bar.className = 'bar-item';
    bar.innerHTML = `
      <div class="bar-outer">
        <div class="bar-inner" style="height:${percent}%; background:${i === 0 ? '#32c37e' : '#d6f5e6'}">
          ${i === 0 ? `<span class='bar-label'>${percent}%</span>` : ''}
        </div>
      </div>
      <div class="bar-x-label">${data.categories[i]}</div>
    `;
    if (i !== 0) {
      bar.innerHTML = bar.innerHTML.replace('</div>', `<span class='bar-label bar-label-secondary'>${percent}%</span></div>`);
    }
    chart.appendChild(bar);
  }
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

function getBarGradient(percent) {
  if (percent < 50) {
    return 'linear-gradient(90deg, #4fd18b 0%, #a8e063 100%)'; // 綠
  } else if (percent < 80) {
    return 'linear-gradient(90deg, #ffe259 0%, #ffa751 100%)'; // 黃
  } else {
    return 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)'; // 紅
  }
}
// 右側家電用電分布進度條
function renderApplianceProgress() {
  const list = document.getElementById('appliance-progress-list');
  if (!list) return;
  list.innerHTML = '';
  const total = appliances.filter(a => a.status).reduce((sum, a) => sum + a.power, 0) || 1;
  appliances.forEach(appliance => {
    if (!appliance.status) return;
    const percent = Math.round((appliance.power / total) * 100);
    const item = document.createElement('div');
    item.className = 'progress-item';
    item.innerHTML = `
      <span class="progress-label">${appliance.name}</span>
      <span class="progress-bar-bg"><span class="progress-bar" style="width:${percent}%; --bar-gradient: ${getBarGradient(percent)}"></span></span>
      <span class="progress-value">${percent}%</span>
    `;
    list.appendChild(item);
  });
}

// 初始化
window.onload = function() {
  renderApplianceStatus();
  renderEnergyChart();
  setupToggleButtons();
  renderPeakTime();
  renderTopAppliance();
  renderApplianceProgress();
}; 