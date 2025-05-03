const axios = require('axios');

// 区域和对应的sector及metadata
const zones = [
    { zoneId: 'A1', sector: 'North', metadata: '{"location": "greenhouse"}' },
    { zoneId: 'A2', sector: 'North', metadata: '{"location": "greenhouse"}' },
    { zoneId: 'B1', sector: 'North', metadata: '{"location": "greenhouse"}' },
    { zoneId: 'B2', sector: 'North', metadata: '{"location": "greenhouse"}' },
    { zoneId: 'C1', sector: 'South', metadata: '{"location": "greenhouse"}' },
    { zoneId: 'C2', sector: 'South', metadata: '{"location": "greenhouse"}' },
    { zoneId: 'D1', sector: 'South', metadata: '{"location": "greenhouse"}' },
    { zoneId: 'D2', sector: 'South', metadata: '{"location": "greenhouse"}' }
];

// 传感器类型
const sensorTypes = ['temperature', 'humidity', 'pressure', 'co2'];

// API URL
const apiUrl = 'http://localhost:8080/api/sensors';

// 生成随机数据的函数
function generateRandomData(sensorType, timeOfDay) {
    // 模拟昼夜变化的因子，基于时间（0-23 小时）
    const dayNightFactor = (timeOfDay >= 6 && timeOfDay < 18) ? 1 : ((timeOfDay >= 18 && timeOfDay <= 23) || timeOfDay < 3) ? 0.8 : 0.9; // 夜间温度等偏低

    switch (sensorType) {
        case 'temperature':
            // 初始值范围调窄，白天 20-25°C，夜间 18-22°C
            if (!this.prevTemp) this.prevTemp = (timeOfDay >= 6 && timeOfDay < 18) ? 20 + Math.random() * 5 : 18 + Math.random() * 4;
            const tempChange = (Math.random() - 0.5) * 1 * dayNightFactor; // 变化幅度减小
            this.prevTemp = Math.max(18, Math.min(25, this.prevTemp + tempChange)); // 限制范围
            return this.prevTemp.toFixed(1);
        case 'humidity':
            // 初始值范围调窄，白天 40-60%，夜间 50-70%
            if (!this.prevHumidity) this.prevHumidity = (timeOfDay >= 6 && timeOfDay < 18) ? 40 + Math.random() * 20 : 50 + Math.random() * 20;
            const humidityChange = (Math.random() - 0.5) * 2 * (dayNightFactor === 1 ? 1.2 : 0.8); // 变化幅度减小
            this.prevHumidity = Math.max(40, Math.min(70, this.prevHumidity + humidityChange));
            return this.prevHumidity.toFixed(1);
        case 'pressure':
            // 初始值范围调窄，1005-1015 hPa
            if (!this.prevPressure) this.prevPressure = 1005 + Math.random() * 10;
            const pressureChange = (Math.random() - 0.5) * 0.5; // 变化幅度减小
            this.prevPressure = Math.max(1005, Math.min(1015, this.prevPressure + pressureChange));
            return this.prevPressure.toFixed(1);
        case 'co2':
            // 初始值范围调窄，白天 400-600 ppm，夜间 500-700 ppm
            if (!this.prevCo2) this.prevCo2 = (timeOfDay >= 6 && timeOfDay < 18) ? 400 + Math.random() * 200 : 500 + Math.random() * 200;
            const co2Change = (Math.random() - 0.5) * 15 * (dayNightFactor === 1 ? 0.8 : 1.2); // 变化幅度减小
            this.prevCo2 = Math.max(400, Math.min(700, this.prevCo2 + co2Change));
            return this.prevCo2.toFixed(0);
        default:
            return Math.random().toFixed(2);
    }
}

// 发送数据的函数
async function sendSensorData(hour) {
    try {
        // 遍历每个区域和传感器类型
        zones.forEach(zone => {
            sensorTypes.forEach(sensorType => {
                const data = {
                    sensorType: sensorType,
                    value: parseFloat(generateRandomData(sensorType, hour)),
                    zoneId: zone.zoneId,
                    sector: zone.sector,
                    metadata: zone.metadata
                };

                // 发送POST请求
                axios.post(apiUrl, data)
                    .then(response => {
                        console.log(`Data sent successfully for ${zone.zoneId} - ${sensorType} at hour ${hour}`);
                        console.log('Response:', response.data);
                    })
                    .catch(error => {
                        console.error(`Error sending data for ${zone.zoneId} - ${sensorType} at hour ${hour}:`, error);
                    });
            });
        });
    } catch (error) {
        console.error('Error in sendSensorData:', error);
    }
}

// 模拟一天的数据，在大约5分钟内完成
console.log('Starting sensor data simulation for a full day...');
const startTime = new Date();

for (let hour = 0; hour < 24; hour++) {
    // 计算每个时间点的延迟，前23小时每小时数据间隔较短，最后一小时适当拉长间隔
    const delay = hour < 23 ? (5 * 60 * 1000) / 23 : (5 * 60 * 1000) / 23 * 3; // 前23小时每小时约13秒，最后一小时约40秒

    setTimeout(() => {
        sendSensorData(hour);
    }, delay * hour);
}

console.log('Simulation started. Data will be sent at appropriate intervals to complete in about 5 minutes.');