import { useEffect, useState, useRef } from "react";
import Alert from "./components/Alert";
import UserTable from "./components/UserTable";
import SubmitButton from "./components/SubmitButton";
import { useHealthcare } from "./hooks/useHealthcare";
import type { Patient } from "./lib/types";
import { useLoading } from "./contexts/LoadingContext";
import { analyzePatients } from "./lib/utils";

interface AlertData {
  id: string;
  type: "high-risk" | "fever" | "data-quality";
  message: string;
  severity: "critical" | "warning" | "info";
}

interface PatientAlertMap {
  [patientId: string]: {
    hasHighRisk: boolean;
    hasFever: boolean;
    hasDataQuality: boolean;
  };
}

function App() {
  const { getPatients, submitAssessment } = useHealthcare();
  const { loading, error } = useLoading();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [patientAlerts, setPatientAlerts] = useState<PatientAlertMap>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const pageLimit = 20;
  const hasLoadedAllPatients = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPatients(currentPage, pageLimit);
      if (response?.data) {
        setPatients(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalPatients(response.pagination.total);

        // Store all patients for submission (fetch all pages only once)
        if (!hasLoadedAllPatients.current) {
          hasLoadedAllPatients.current = true;
          const allPagesData: Patient[] = [...response.data];

          // Fetch remaining pages
          for (let page = 2; page <= response.pagination.totalPages; page++) {
            const pageResponse = await getPatients(page, pageLimit);
            if (pageResponse?.data) {
              allPagesData.push(...pageResponse.data);
            }
          }
          setAllPatients(allPagesData);

          // Generate alerts from all patients after loading
          const fullAnalysis = analyzePatients(allPagesData);

          // Create patient alert mapping
          const patientAlertMapping: PatientAlertMap = {};
          fullAnalysis.analyses.forEach((analysis) => {
            patientAlertMapping[analysis.patientId] = {
              hasHighRisk: analysis.isHighRisk,
              hasFever: analysis.hasFever,
              hasDataQuality: analysis.hasDataQualityIssues,
            };
          });
          setPatientAlerts(patientAlertMapping);

          const newAlerts: AlertData[] = [];

          if (fullAnalysis.highRiskPatients.length > 0) {
            newAlerts.push({
              id: "high-risk",
              type: "high-risk",
              message: `${fullAnalysis.highRiskPatients.length} patient${
                fullAnalysis.highRiskPatients.length > 1 ? "s" : ""
              } identified as high risk`,
              severity: "critical",
            });
          }

          if (fullAnalysis.feverPatients.length > 0) {
            newAlerts.push({
              id: "fever",
              type: "fever",
              message: `${fullAnalysis.feverPatients.length} patient${
                fullAnalysis.feverPatients.length > 1 ? "s" : ""
              } with elevated temperature`,
              severity: "warning",
            });
          }

          if (fullAnalysis.dataQualityIssues.length > 0) {
            newAlerts.push({
              id: "data-quality",
              type: "data-quality",
              message: `${fullAnalysis.dataQualityIssues.length} patient${
                fullAnalysis.dataQualityIssues.length > 1 ? "s" : ""
              } with data quality issues`,
              severity: "info",
            });
          }

          setAlerts(newAlerts);
        }
      }
    };

    fetchData();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to submit the assessment? This will analyze all patients and submit the results."
    );

    if (!confirmed) {
      return;
    }

    // Analyze all patients
    const analysis = analyzePatients(allPatients);

    // Submit assessment
    const result = await submitAssessment({
      high_risk_patients: analysis.highRiskPatients,
      fever_patients: analysis.feverPatients,
      data_quality_issues: analysis.dataQualityIssues,
    });

    if (result) {
      alert(
        `Assessment submitted successfully!\n\nScore: ${result.results.score}/${
          result.results.breakdown.high_risk.max +
          result.results.breakdown.fever.max +
          result.results.breakdown.data_quality.max
        }\nPercentage: ${result.results.percentage}%\nStatus: ${
          result.results.status
        }\n\nMessage: ${result.message}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Healthcare Dashboard
        </h1>

        {/* Alert Header Section */}
        <div className="mb-6 space-y-3">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              id={alert.id}
              type={alert.type}
              message={alert.message}
              severity={alert.severity}
            />
          ))}
        </div>

        {/* Submit Button Section */}
        <div className="mb-6 flex justify-end">
          <SubmitButton
            disabled={loading || allPatients.length === 0}
            onClick={handleSubmit}
          />
        </div>

        {/* User Table Section */}
        {loading && (
          <div className="text-center py-12 text-gray-600">
            Loading patients...
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {!loading && !error && (
          <UserTable
            users={patients}
            patientAlerts={patientAlerts}
            currentPage={currentPage}
            totalPages={totalPages}
            totalPatients={totalPatients}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
