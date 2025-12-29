import type { Patient } from './types';

interface RiskScores {
  bloodPressure: number;
  temperature: number;
  age: number;
  total: number;
}

interface PatientRiskAnalysis {
  patientId: string;
  riskScores: RiskScores;
  isHighRisk: boolean;
  hasFever: boolean;
  hasDataQualityIssues: boolean;
}

// Helper function to parse blood pressure
const parseBloodPressure = (bp: string): { systolic?: number; diastolic?: number } => {
  if (!bp || typeof bp !== 'string') return {};
  
  const match = bp.match(/(\d+)\/(\d+)/);
  if (!match) return {};
  
  return {
    systolic: parseInt(match[1]),
    diastolic: parseInt(match[2])
  };
};

// Calculate blood pressure risk score (0-3 points)
const calculateBloodPressureRisk = (bp: string): number => {
  const { systolic, diastolic } = parseBloodPressure(bp);
  
  // Invalid/Missing Data
  if (systolic === undefined || diastolic === undefined) {
    return 0;
  }
  
  // Normal: <120/<80
  if (systolic < 120 && diastolic < 80) {
    return 0;
  }
  
  // Elevated: 120-129/<80
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return 1;
  }
  
  // Stage 1: 130-139/80-89
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return 2;
  }
  
  // Stage 2: ≥140/≥90
  if (systolic >= 140 || diastolic >= 90) {
    return 3;
  }
  
  return 0;
};

// Calculate temperature risk score (0-2 points)
const calculateTemperatureRisk = (temp: number): number => {
  // Invalid/Missing Data
  if (temp === null || temp === undefined || isNaN(temp)) {
    return 0;
  }
  
  // Normal: ≤99.5°F
  if (temp <= 99.5) {
    return 0;
  }
  
  // Low Fever: 99.6-100.9°F
  if (temp >= 99.6 && temp < 101.0) {
    return 1;
  }
  
  // High Fever: ≥101.0°F
  if (temp >= 101.0) {
    return 2;
  }
  
  return 0;
};

// Calculate age risk score (0-2 points)
const calculateAgeRisk = (age: number): number => {
  // Invalid/Missing Data
  if (age === null || age === undefined || isNaN(age)) {
    return 0;
  }
  
  // Under 40: <40 years
  if (age < 40) {
    return 0;
  }
  
  // 40-65: 40-65 years (inclusive)
  if (age >= 40 && age <= 65) {
    return 1;
  }
  
  // Over 65: >65 years
  if (age > 65) {
    return 2;
  }
  
  return 0;
};

// Check for data quality issues
const hasDataQualityIssues = (patient: Patient): boolean => {
  const { systolic, diastolic } = parseBloodPressure(patient.blood_pressure);
  
  // Check for invalid/missing blood pressure
  if (systolic === undefined || diastolic === undefined) {
    return true;
  }
  
  // Check for invalid/missing temperature
  if (patient.temperature === null || patient.temperature === undefined || isNaN(patient.temperature)) {
    return true;
  }
  
  // Check for invalid/missing age
  if (patient.age === null || patient.age === undefined || isNaN(patient.age)) {
    return true;
  }
  
  return false;
};

// Main risk analysis function
export const checkRisk = (patient: Patient): PatientRiskAnalysis => {
  const bloodPressureRisk = calculateBloodPressureRisk(patient.blood_pressure);
  const temperatureRisk = calculateTemperatureRisk(patient.temperature);
  const ageRisk = calculateAgeRisk(patient.age);
  const totalRisk = bloodPressureRisk + temperatureRisk + ageRisk;
  
  const hasFever = patient.temperature >= 99.6 && 
                  patient.temperature !== null && 
                  patient.temperature !== undefined && 
                  !isNaN(patient.temperature);
  
  return {
    patientId: patient.patient_id,
    riskScores: {
      bloodPressure: bloodPressureRisk,
      temperature: temperatureRisk,
      age: ageRisk,
      total: totalRisk
    },
    isHighRisk: totalRisk >= 4,
    hasFever: hasFever,
    hasDataQualityIssues: hasDataQualityIssues(patient)
  };
};

// Analyze multiple patients and generate alert lists
export const analyzePatients = (patients: Patient[]): {
  highRiskPatients: string[];
  feverPatients: string[];
  dataQualityIssues: string[];
  analyses: PatientRiskAnalysis[];
} => {
  const analyses = patients.map(checkRisk);
  
  const highRiskPatients = analyses
    .filter(analysis => analysis.isHighRisk)
    .map(analysis => analysis.patientId);
  
  const feverPatients = analyses
    .filter(analysis => analysis.hasFever)
    .map(analysis => analysis.patientId);
  
  const dataQualityIssues = analyses
    .filter(analysis => analysis.hasDataQualityIssues)
    .map(analysis => analysis.patientId);
  
  return {
    highRiskPatients,
    feverPatients,
    dataQualityIssues,
    analyses
  };
};
