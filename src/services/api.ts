import { TelemetryReading } from "../hooks/useSimulation";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchTelemetry = async (): Promise<TelemetryReading[]> => {
  try {
    const response = await fetch(`${API_URL}/telemetry`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch telemetry:", error);
    throw error;
  }
};

export const fetchAlerts = async () => {
  try {
    const response = await fetch(`${API_URL}/alerts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    throw error;
  }
};
