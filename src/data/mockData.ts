export const hives = [
  {
    id: 'A01', name: 'Hive A-01', location: 'North Field', status: 'healthy',
    healthScore: 94, temperature: 34.2, humidity: 62, weight: 42.8,
    pressure: 1008, beeActivity: 'High', buzzing: 67, vibration: 0.13,
    airQuality: 'Good', vocIndex: 78, swarmingRisk: 'Low', swarmingRiskPct: 12,
    queenStatus: 'Normal', queenlessRisk: 6, diseaseRisk: 8,
    lastUpdated: '10s ago', weightChange: +1.2,
    envHealth: 96, behavioralHealth: 92, productivity: 90, stability: 95,
  },
  {
    id: 'A02', name: 'Hive A-02', location: 'South Garden', status: 'attention',
    healthScore: 72, temperature: 36.4, humidity: 69, weight: 40.2,
    pressure: 1007, beeActivity: 'Very High', buzzing: 82, vibration: 0.41,
    airQuality: 'Moderate', vocIndex: 112, swarmingRisk: 'High', swarmingRiskPct: 74,
    queenStatus: 'Normal', queenlessRisk: 12, diseaseRisk: 9,
    lastUpdated: '8m ago', weightChange: -1.4,
    envHealth: 71, behavioralHealth: 68, productivity: 74, stability: 62,
  },
  {
    id: 'B01', name: 'Hive B-01', location: 'East Meadow', status: 'warning',
    healthScore: 81, temperature: 34.8, humidity: 65, weight: 38.5,
    pressure: 1009, beeActivity: 'Normal', buzzing: 60, vibration: 0.29,
    airQuality: 'Good', vocIndex: 82, swarmingRisk: 'Low', swarmingRiskPct: 18,
    queenStatus: 'Normal', queenlessRisk: 8, diseaseRisk: 11,
    lastUpdated: '24m ago', weightChange: +0.3,
    envHealth: 83, behavioralHealth: 79, productivity: 80, stability: 77,
  },
  {
    id: 'B02', name: 'Hive B-02', location: 'West Grove', status: 'healthy',
    healthScore: 89, temperature: 33.9, humidity: 60, weight: 44.1,
    pressure: 1010, beeActivity: 'Normal', buzzing: 61, vibration: 0.11,
    airQuality: 'Good', vocIndex: 74, swarmingRisk: 'Low', swarmingRiskPct: 8,
    queenStatus: 'Normal', queenlessRisk: 4, diseaseRisk: 6,
    lastUpdated: '15s ago', weightChange: +0.8,
    envHealth: 91, behavioralHealth: 87, productivity: 89, stability: 93,
  },
];

export const temperatureHistory = [
  { time: '00:00', value: 32.4 }, { time: '02:00', value: 32.1 },
  { time: '04:00', value: 31.8 }, { time: '06:00', value: 32.6 },
  { time: '08:00', value: 33.4 }, { time: '10:00', value: 34.0 },
  { time: '12:00', value: 34.8 }, { time: '14:00', value: 35.0 },
  { time: '16:00', value: 34.6 }, { time: '18:00', value: 34.2 },
  { time: '20:00', value: 33.8 }, { time: '22:00', value: 33.2 },
  { time: 'Now', value: 34.2 },
];

export const humidityHistory = [
  { time: '00:00', value: 58 }, { time: '02:00', value: 57 },
  { time: '04:00', value: 58 }, { time: '06:00', value: 60 },
  { time: '08:00', value: 62 }, { time: '10:00', value: 63 },
  { time: '12:00', value: 64 }, { time: '14:00', value: 63 },
  { time: '16:00', value: 62 }, { time: '18:00', value: 61 },
  { time: '20:00', value: 60 }, { time: '22:00', value: 59 },
  { time: 'Now', value: 62 },
];

export const weightHistory = [
  { date: 'Mon', value: 41.2 }, { date: 'Tue', value: 41.7 },
  { date: 'Wed', value: 42.0 }, { date: 'Thu', value: 42.4 },
  { date: 'Fri', value: 42.5 }, { date: 'Sat', value: 42.6 },
  { date: 'Sun', value: 42.8 },
];

export const activityHistory = [
  { time: '06:00', value: 22 }, { time: '07:00', value: 45 },
  { time: '08:00', value: 68 }, { time: '09:00', value: 82 },
  { time: '10:00', value: 87 }, { time: '11:00', value: 91 },
  { time: '12:00', value: 88 }, { time: '13:00', value: 85 },
  { time: '14:00', value: 79 }, { time: '15:00', value: 72 },
  { time: '16:00', value: 65 }, { time: '17:00', value: 48 },
  { time: '18:00', value: 28 },
];

export const pressureHistory = [
  { time: '00:00', value: 1010 }, { time: '04:00', value: 1009 },
  { time: '08:00', value: 1008 }, { time: '12:00', value: 1008 },
  { time: '16:00', value: 1007 }, { time: '20:00', value: 1008 },
  { time: 'Now', value: 1008 },
];

export const buzzingHistory = [
  { time: '00:00', value: 42 }, { time: '02:00', value: 38 },
  { time: '04:00', value: 36 }, { time: '06:00', value: 50 },
  { time: '08:00', value: 58 }, { time: '10:00', value: 62 },
  { time: '12:00', value: 67 }, { time: '14:00', value: 64 },
  { time: '16:00', value: 60 }, { time: '18:00', value: 55 },
  { time: '20:00', value: 48 }, { time: '22:00', value: 44 },
  { time: 'Now', value: 67 },
];

export const vibrationHistory = [
  { time: '00:00', value: 0.08 }, { time: '04:00', value: 0.07 },
  { time: '08:00', value: 0.10 }, { time: '12:00', value: 0.12 },
  { time: '16:00', value: 0.13 }, { time: '20:00', value: 0.11 },
  { time: 'Now', value: 0.13 },
];

export const weeklyTemperature = Array.from({ length: 28 }, (_, i) => ({
  date: `Day ${i + 1}`,
  avg: 33.2 + Math.sin(i * 0.4) * 1.2,
  min: 30.8 + Math.sin(i * 0.4) * 0.8,
  max: 35.4 + Math.sin(i * 0.3) * 1.4,
}));

export const weeklyWeight = Array.from({ length: 28 }, (_, i) => ({
  date: `Day ${i + 1}`,
  value: 40.0 + i * 0.1 + Math.sin(i * 0.5) * 0.3,
}));

export const alerts = [
  {
    id: 1, severity: 'critical', type: 'Possible Swarming Behavior',
    hive: 'Hive A-02', hiveId: 'A02', time: '10:32 AM', status: 'Active',
    confidence: 89, reason: 'Elevated buzzing activity and unusual movement patterns were detected alongside a decrease in hive weight.',
    readings: { temperature: 36.4, humidity: 69, weight: -1.4, buzzing: 'High', activity: 'Very High' },
  },
  {
    id: 2, severity: 'warning', type: 'Unusual Vibration Detected',
    hive: 'Hive B-01', hiveId: 'B01', time: '9:45 AM', status: 'Active',
    confidence: 76, reason: 'Vibration sensor detected irregular patterns inconsistent with normal colony activity.',
    readings: { temperature: 34.8, humidity: 65, weight: 0.1, buzzing: 'Normal', activity: 'Normal' },
  },
  {
    id: 3, severity: 'warning', type: 'Humidity Above Optimal Range',
    hive: 'Hive A-02', hiveId: 'A02', time: '8:52 AM', status: 'Active',
    confidence: 94, reason: 'Humidity has been above the configured threshold of 75% for over 45 minutes.',
    readings: { temperature: 36.4, humidity: 69, weight: -0.2, buzzing: 'High', activity: 'High' },
  },
  {
    id: 4, severity: 'info', type: 'Sensor Connection Restored',
    hive: 'Hive B-01', hiveId: 'B01', time: '7:12 AM', status: 'Resolved',
    confidence: 100, reason: 'BME680 sensor reconnected after brief communication interruption.',
    readings: { temperature: 34.2, humidity: 63, weight: 0, buzzing: 'Normal', activity: 'Normal' },
  },
];
