import React from "react";
import type { Patient } from "../lib/types";

interface PatientAlertMap {
  [patientId: string]: {
    hasHighRisk: boolean;
    hasFever: boolean;
    hasDataQuality: boolean;
  };
}

interface UserTableProps {
  users: Patient[];
  patientAlerts: PatientAlertMap;
  currentPage: number;
  totalPages: number;
  totalPatients: number;
  onPageChange: (page: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  patientAlerts,
  currentPage,
  totalPages,
  totalPatients,
  onPageChange,
}) => {
  const getPatientStatusColor = (patientId: string): string => {
    const alert = patientAlerts[patientId];
    if (!alert) return "bg-gray-300";
    if (alert.hasHighRisk) return "bg-red-500";
    if (alert.hasFever) return "bg-yellow-500";
    if (alert.hasDataQuality) return "bg-blue-500";
    return "bg-green-500";
  };
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Patient Monitor</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Pressure
              </th>
              <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temperature
              </th>
              <th className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diagnosis
              </th>
              <th className="w-56 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medications
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visit Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.patient_id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getPatientStatusColor(
                        user.patient_id
                      )}`}
                    ></div>
                    {user.name}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.age}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.gender}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.blood_pressure || "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.temperature}°F
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {user.diagnosis}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {user.medications}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.visit_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing page {currentPage} of {totalPages} ({totalPatients} total
          patients)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            Page {currentPage}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
