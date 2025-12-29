/**
 * Type definitions for the Healthcare Patient Risk Analysis System
 * 
 * This file contains all TypeScript interfaces and types used throughout the application
 * for patient data management, API responses, and assessment submissions.
 */

/**
 * Represents a patient record from the API
 */
export interface Patient {
  patient_id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  blood_pressure: string;
  temperature: number;
  visit_date: string;
  diagnosis: string;
  medications: string;
}

/**
 * Pagination metadata for patient list responses
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * API response structure for GET /patients endpoint
 */
export interface PatientsResponse {
  data: Patient[];
  pagination: Pagination;
  metadata: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

/**
 * Data structure for submitting patient risk assessment results
 * Contains arrays of patient IDs categorized by risk type
 */
export interface AssessmentSubmission {
  high_risk_patients: string[];
  fever_patients: string[];
  data_quality_issues: string[];
}

/**
 * Breakdown of assessment scores for a specific category
 */
interface AssessmentBreakdown {
  score: number;
  max: number;
  correct: number;
  submitted: number;
  matches: number;
}

/**
 * Complete breakdown of assessment results across all categories
 */
interface ResultsBreakdown {
  high_risk: AssessmentBreakdown;
  fever: AssessmentBreakdown;
  data_quality: AssessmentBreakdown;
}

/**
 * Feedback provided by the assessment API
 */
interface Feedback {
  strengths: string[];
  issues: string[];
}

/**
 * Detailed results from assessment submission
 */
export interface AssessmentResults {
  score: number;
  percentage: number;
  status: "PASS" | "FAIL";
  breakdown: ResultsBreakdown;
  feedback: Feedback;
  attempt_number: number;
  remaining_attempts: number;
  is_personal_best: boolean;
  can_resubmit: boolean;
}

/**
 * API response structure for POST /submit-assessment endpoint
 */
export interface SubmitResponse {
  success: boolean;
  message: string;
  results: AssessmentResults;
}
