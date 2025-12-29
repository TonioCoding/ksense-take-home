import React from "react";

interface AlertProps {
  id: string;
  type: "high-risk" | "fever" | "data-quality";
  message: string;
  severity: "critical" | "warning" | "info";
}

const Alert: React.FC<AlertProps> = ({ message, severity }) => {
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 border-red-400 text-red-700";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-700";
      default:
        return "bg-gray-100 border-gray-400 text-gray-700";
    }
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-lg ${getAlertColor(severity)}`}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Alert;
