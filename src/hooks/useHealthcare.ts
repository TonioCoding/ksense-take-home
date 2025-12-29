/**
 * useHealthcare Hook - API integration for healthcare patient data
 * 
 * This custom hook provides functions to interact with the healthcare assessment API,
 * including fetching patient data and submitting risk assessments.
 * 
 * Features:
 * - Fetches paginated patient data from the API
 * - Submits patient risk assessment results
 * - Automatic loading and error state management via LoadingContext
 * - Proper error handling with API error message extraction
 * 
 * @example
 * ```tsx
 * const { getPatients, submitAssessment, refreshPatients } = useHealthcare();
 * 
 * // Fetch patients
 * const response = await getPatients(1, 20);
 * 
 * // Submit assessment
 * const result = await submitAssessment({
 *   high_risk_patients: ['P001', 'P002'],
 *   fever_patients: ['P003'],
 *   data_quality_issues: ['P004']
 * });
 * ```
 */

import { useCallback } from "react";
import type {
  PatientsResponse,
  AssessmentSubmission,
  SubmitResponse,
} from "../lib/types";
import { useLoading } from "../contexts/LoadingContext";

const API_BASE = "https://assessment.ksensetech.com/api";
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Custom hook for healthcare API operations
 * @returns {Object} API functions for patient data management
 */
export const useHealthcare = () => {
  const { setLoading, setError, clearError } = useLoading();

  /**
   * Fetches paginated patient data from the API
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Number of records per page (max: 20, default: 10)
   * @returns {Promise<PatientsResponse | null>} Patient data with pagination metadata, or null on error
   */
  const getPatients = useCallback(
    async (
      page: number = 1,
      limit: number = 10
    ): Promise<PatientsResponse | null> => {
      setLoading(true);
      clearError();

      try {
        const response = await fetch(
          `${API_BASE}/patients?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw { error: errorData.error || `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
      } catch (err: any) {
        const errorMessage = err.error || (err instanceof Error ? err.message : "Failed to fetch patients");
        setError(errorMessage);
        console.error("Error fetching patients:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError]
  );

  /**
   * Submits patient risk assessment results to the API
   * @param {AssessmentSubmission} results - Assessment results with categorized patient IDs
   * @returns {Promise<SubmitResponse | null>} Assessment score and feedback, or null on error
   */
  const submitAssessment = useCallback(
    async (results: AssessmentSubmission): Promise<SubmitResponse | null> => {
      setLoading(true);
      clearError();

      try {
        const response = await fetch(`${API_BASE}/submit-assessment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
          body: JSON.stringify(results),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw { error: errorData.error || `HTTP error! status: ${response.status}` };
        }

        const data = await response.json();
        return data;
      } catch (err: any) {
        const errorMessage = err.error || (err instanceof Error ? err.message : "Failed to submit assessment");
        setError(errorMessage);
        console.error("Error submitting assessment:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, clearError]
  );

  /**
   * Convenience function to refresh the first page of patients
   * @returns {Promise<PatientsResponse | null>} First page of patient data
   */
  const refreshPatients = useCallback(async () => {
    return await getPatients(1, 10);
  }, [getPatients]);

  return {
    getPatients,
    submitAssessment,
    refreshPatients,
  };
};
