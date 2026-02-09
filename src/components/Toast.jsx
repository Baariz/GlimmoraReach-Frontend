import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-20 right-6 z-[200] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white animate-slide-right flex items-center gap-2 min-w-[250px] ${
              t.type === 'success' ? 'gradient-primary' :
              t.type === 'error' ? 'bg-red-500' :
              t.type === 'info' ? 'bg-blue-500' :
              'bg-amber-500'
            }`}
          >
            <span>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'info' ? 'ℹ' : '⚠'}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
