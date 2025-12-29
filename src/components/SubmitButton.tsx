import React from "react";

interface SubmitButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ disabled = true, onClick }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        px-6 py-2.5 rounded-md font-medium text-sm transition-all shadow-sm
        ${disabled 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md cursor-pointer'
        }
      `}
    >
      Submit Assessment
    </button>
  );
};

export default SubmitButton;
