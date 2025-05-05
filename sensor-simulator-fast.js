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
const sensorTypes = ['temperature', 'humidity', 'pressure', 'co2', 'lightIntensity'];

// API URL
const apiUrl = 'http://localhost:8080/api/sensors';

// 生成随机数据的函数
function generateRandomData(sensorType, timeOfDay) {

    switch (sensorType) {
        case 'temperature':
            if (!this.prevTemperature) {
                // 初始化温度，根据时间设置初始值
                if (timeOfDay >= 0 && timeOfDay < 6) {
                    // 夜间：温度较低
                    this.prevTemperature = 20 + Math.random() * 5;
                } else if (timeOfDay >= 6 && timeOfDay < 10) {
                    // 清晨到上午：温度逐渐上升
                    this.prevTemperature = 20 + (timeOfDay - 6) * 3.33 + Math.random() * 3;
                } else if (timeOfDay >= 10 && timeOfDay < 14) {
                    // 上午到中午：温度迅速上升，到中午达到28-35℃
                    this.prevTemperature = 20 + (timeOfDay - 10) * 3.75 + Math.random() * 5;
                } else if (timeOfDay >= 14 && timeOfDay < 18) {
                    // 中午到傍晚：温度逐渐下降，从峰值降至25℃左右
                    this.prevTemperature = 30 - (timeOfDay - 14) * 3.33 + Math.random() * 3;
                } else if (timeOfDay >= 18 && timeOfDay < 24) {
                    // 傍晚到夜间：温度继续下降，保持在15-20℃
                    this.prevTemperature = 25 - (timeOfDay - 18) * 1.67 + Math.random() * 3;
                }
            }
        
            // 根据时间调整温度的变化幅度和方向
            let temperatureChange = 0;
            if (timeOfDay >= 6 && timeOfDay < 10) {
                // 清晨到上午：温度逐渐上升
                temperatureChange = (Math.random() * 0.2 + 0.1);
            } else if (timeOfDay >= 10 && timeOfDay < 14) {
                // 上午到中午：温度迅速上升
                temperatureChange = (Math.random() * 0.3 + 0.2);
            } else if (timeOfDay >= 14 && timeOfDay < 18) {
                // 中午到傍晚：温度逐渐下降
                temperatureChange = -(Math.random() * 0.3 + 0.2);
            } else if (timeOfDay >= 18 && timeOfDay < 24) {
                // 傍晚到夜间：温度继续下降
                temperatureChange = -(Math.random() * 0.1 + 0.05);
            } else {
                // 夜间：温度变化较小
                temperatureChange = (Math.random() - 0.5) * 0.1;
            }
        
            // 更新温度，确保在合理范围内
            this.prevTemperature = Math.max(15, Math.min(35, this.prevTemperature + temperatureChange));
        
            return this.prevTemperature.toFixed(1);
        case 'humidity':
            if (!this.prevHumidity) {
                // 初始化湿度，根据时间设置初始值
                if (timeOfDay >= 0 && timeOfDay < 6) {
                    // 夜间：湿度较高，80%-90%
                    this.prevHumidity = 80 + Math.random() * 10;
                } else if (timeOfDay >= 6 && timeOfDay < 10) {
                    // 清晨到上午：湿度逐渐降低，从80%-90%降至70%-80%
                    this.prevHumidity = 80 - (timeOfDay - 6) * 3.33 + Math.random() * 5;
                } else if (timeOfDay >= 10 && timeOfDay < 14) {
                    // 上午到中午：湿度继续下降，60%-70%
                    this.prevHumidity = 75 - (timeOfDay - 10) * 2.5 + Math.random() * 5;
                } else if (timeOfDay >= 14 && timeOfDay < 18) {
                    // 中午到傍晚：湿度逐渐上升，70%-80%
                    this.prevHumidity = 70 + (timeOfDay - 14) * 2.5 + Math.random() * 5;
                } else if (timeOfDay >= 18 && timeOfDay < 24) {
                    // 傍晚到夜间：湿度继续上升，80%-90%
                    this.prevHumidity = 70 + (timeOfDay - 18) * 2.5 + Math.random() * 5;
                }
            }
        
            // 根据时间调整湿度的变化幅度和方向
            let humidityChange = 0;
            if (timeOfDay >= 6 && timeOfDay < 10) {
                // 清晨到上午：湿度逐渐降低
                humidityChange = -(Math.random() * 0.5 + 0.3);
            } else if (timeOfDay >= 10 && timeOfDay < 14) {
                // 上午到中午：湿度继续下降
                humidityChange = -(Math.random() * 0.4 + 0.2);
            } else if (timeOfDay >= 14 && timeOfDay < 18) {
                // 中午到傍晚：湿度逐渐上升
                humidityChange = (Math.random() * 0.4 + 0.2);
            } else if (timeOfDay >= 18 && timeOfDay < 24) {
                // 傍晚到夜间：湿度继续上升
                humidityChange = (Math.random() * 0.5 + 0.2);
            } else {
                // 夜间：湿度变化较小
                humidityChange = (Math.random() - 0.5) * 0.2;
            }
        
            // 更新湿度，确保在合理范围内
            this.prevHumidity = Math.max(60, Math.min(88, this.prevHumidity + humidityChange));
        
            return this.prevHumidity.toFixed(1);
        case 'pressure':
            if (!this.prevPressure) {
                // 初始化气压，根据时间设置初始值
                if (timeOfDay >= 0 && timeOfDay < 6) {
                    // 夜间：气压相对较高，接近外界气压
                    this.prevPressure = 1013.25 + (Math.random() - 0.5) * 5;
                } else if (timeOfDay >= 6 && timeOfDay < 12) {
                    // 清晨到中午：气压逐渐降低
                    this.prevPressure = 1013.25 - (timeOfDay - 6) * 0.4167 + (Math.random() - 0.5) * 3;
                } else if (timeOfDay >= 12 && timeOfDay < 18) {
                    // 中午到傍晚：气压逐渐回升
                    this.prevPressure = 1013.25 - 2.5 + (timeOfDay - 12) * 0.25 + (Math.random() - 0.5) * 3;
                } else if (timeOfDay >= 18 && timeOfDay < 24) {
                    // 傍晚到夜间：气压相对稳定
                    this.prevPressure = 1013.25 - 0.5 + (Math.random() - 0.5) * 2;
                }
            }
        
            // 根据时间调整气压的变化幅度和方向
            let pressureChange = 0;
            if (timeOfDay >= 6 && timeOfDay < 12) {
                // 清晨到中午：气压逐渐降低
                pressureChange = -(Math.random() * 0.1 + 0.05);
            } else if (timeOfDay >= 12 && timeOfDay < 18) {
                // 中午到傍晚：气压逐渐回升
                pressureChange = (Math.random() * 0.1 + 0.05);
            } else {
                // 夜间和傍晚：气压变化较小
                pressureChange = (Math.random() - 0.5) * 0.1;
            }
        
            // 更新气压，确保在合理范围内
            this.prevPressure = Math.max(1010, Math.min(1015, this.prevPressure + pressureChange));
        
            return this.prevPressure.toFixed(1);
        case 'co2':
            if (!this.prevCO2) {
                // 初始化二氧化碳浓度，根据时间设置初始值
                if (timeOfDay >= 0 && timeOfDay < 6) {
                    // 夜间：二氧化碳浓度较高，500-800ppm
                    this.prevCO2 = 500 + Math.random() * 300;
                } else if (timeOfDay >= 6 && timeOfDay < 10) {
                    // 清晨到上午：二氧化碳浓度逐渐降低，300-500ppm
                    this.prevCO2 = 500 - (timeOfDay - 6) * 50 + Math.random() * 90;
                } else if (timeOfDay >= 10 && timeOfDay < 14) {
                    // 上午到中午：二氧化碳浓度继续下降，接近300ppm
                    this.prevCO2 = 500 - (timeOfDay - 10) * 25 + Math.random() * 50;
                } else if (timeOfDay >= 14 && timeOfDay < 18) {
                    // 中午到傍晚：二氧化碳浓度缓慢回升，400-600ppm
                    this.prevCO2 = 300 + (timeOfDay - 14) * 37.5 + Math.random() * 100;
                } else if (timeOfDay >= 18 && timeOfDay < 24) {
                    // 傍晚到夜间：二氧化碳浓度持续上升，500-800ppm
                    this.prevCO2 = 300 + (timeOfDay - 18) * 50 + Math.random() * 150;
                }
            }
        
            // 根据时间调整二氧化碳浓度的变化幅度和方向
            let co2Change = 0;
            if (timeOfDay >= 6 && timeOfDay < 10) {
                // 清晨到上午：二氧化碳浓度逐渐降低
                co2Change = -(Math.random() * 10 + 5);
            } else if (timeOfDay >= 10 && timeOfDay < 14) {
                // 上午到中午：二氧化碳浓度继续下降
                co2Change = -(Math.random() * 8 + 3);
            } else if (timeOfDay >= 14 && timeOfDay < 18) {
                // 中午到傍晚：二氧化碳浓度缓慢回升
                co2Change = (Math.random() * 8 + 3);
            } else if (timeOfDay >= 18 && timeOfDay < 24) {
                // 傍晚到夜间：二氧化碳浓度持续上升
                co2Change = (Math.random() * 10 + 5);
            } else {
                // 夜间：二氧化碳浓度变化较小
                co2Change = (Math.random() - 0.5) * 4;
            }
        
            // 更新二氧化碳浓度，确保在合理范围内
            this.prevCO2 = Math.max(300, Math.min(1000, this.prevCO2 + co2Change));
        
            return this.prevCO2.toFixed(1);
        case 'lightIntensity':
            if (!this.prevLightIntensity) {
                // 初始化光照强度，根据时间设置初始值
                if (timeOfDay >= 6 && timeOfDay < 18) {
                  // 白天初始值根据时间设置
                  if (timeOfDay >= 6 && timeOfDay < 8) {
                    // 清晨：日出后，光照强度逐渐增强，从接近0开始缓慢上升
                    this.prevLightIntensity = Math.random() * 10000;
                  } else if (timeOfDay >= 8 && timeOfDay < 11) {
                    // 上午：光照强度迅速增加，到10点左右达到30000-50000lux
                    this.prevLightIntensity = 10000 + Math.random() * 40000;
                  } else if (timeOfDay >= 11 && timeOfDay < 13) {
                    // 中午：光照强度达到峰值，可能超过50000lux，甚至可达70000lux
                    this.prevLightIntensity = 50000 + Math.random() * 20000;
                  } else if (timeOfDay >= 13 && timeOfDay < 16) {
                    // 下午：光照强度逐渐减弱，4点左右降至30000-40000lux
                    this.prevLightIntensity = 30000 + Math.random() * 20000;
                  } else if (timeOfDay >= 16 && timeOfDay < 18) {
                    // 傍晚：继续下降，日落前降至10000lux以下
                    this.prevLightIntensity = Math.random() * 10000;
                  }
                } else {
                  // 夜间：光照强度接近0，若有月光可能在0.3-0.03lux之间
                  this.prevLightIntensity = Math.random() * 0.3;
                }
              }
            
              // 根据时间调整光照强度的变化幅度和方向
              let lightIntensityChange = 0;
              if (timeOfDay >= 6 && timeOfDay < 8) {
                // 清晨：缓慢上升
                lightIntensityChange = (Math.random() * 0.5 + 0.5) * 100;
              } else if (timeOfDay >= 8 && timeOfDay < 11) {
                // 上午：迅速增加
                lightIntensityChange = (Math.random() * 1 + 1) * 1000;
              } else if (timeOfDay >= 11 && timeOfDay < 13) {
                // 中午：在峰值附近波动
                lightIntensityChange = (Math.random() - 0.5) * 5000;
              } else if (timeOfDay >= 13 && timeOfDay < 16) {
                // 下午：逐渐减弱
                lightIntensityChange = -(Math.random() * 0.5 + 0.5) * 1000;
              } else if (timeOfDay >= 16 && timeOfDay < 18) {
                // 傍晚：继续下降
                lightIntensityChange = -(Math.random() * 0.5 + 0.5) * 600;
              } else if (timeOfDay >= 18 && timeOfDay < 24 || timeOfDay >= 0 && timeOfDay < 6) {
                // 夜间：迅速降到接近0
                lightIntensityChange = -(Math.random() * 0.5 + 0.5) * 100;
              }
            
              // 更新光照强度，确保在合理范围内
              if (timeOfDay >= 6 && timeOfDay < 18) {
                this.prevLightIntensity = Math.max(0, Math.min(70000, this.prevLightIntensity + lightIntensityChange));
              } else {
                this.prevLightIntensity = Math.max(0, Math.min(0.3, this.prevLightIntensity + lightIntensityChange));
              }
            
              return this.prevLightIntensity.toFixed(1);
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
    // 计算每个时间点的延迟，使得所有24个点在一分钟内均匀生成
    const delay = (60 * 1000) / 24 * hour; // 每个点之间的间隔大约为2.5秒

    setTimeout(() => {
        sendSensorData(hour);
    }, delay);
}

console.log('Simulation started. Data will be sent at appropriate intervals to complete in about 1 minutes.');