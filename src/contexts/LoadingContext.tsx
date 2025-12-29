/**
 * LoadingContext - Global state management for loading and error states
 * 
 * This context provides a centralized way to manage loading states and error messages
 * across the application, eliminating the need for local state in individual components.
 * 
 * @example
 * ```tsx
 * // Wrap your app with the provider
 * <LoadingProvider>
 *   <App />
 * </LoadingProvider>
 * 
 * // Use in components
 * const { loading, error, setLoading, setError, clearError } = useLoading();
 * ```
 */

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/**
 * Context type definition for loading and error state management
 */
interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Custom hook to access loading and error state
 * @throws {Error} If used outside of LoadingProvider
 * @returns {LoadingContextType} Loading context with state and setters
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

/**
 * Provider component that wraps the application to provide loading/error state
 * @param {ReactNode} children - Child components to wrap
 */
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading, error, setError, clearError }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
