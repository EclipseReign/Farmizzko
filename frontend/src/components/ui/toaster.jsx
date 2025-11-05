import React from 'react';
import { useToast } from '../../hooks/use-toast';

const Toaster = () => {
  const { toasts, removeToast } = useToast();
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            p-4 rounded-lg shadow-lg backdrop-blur-sm border
            ${toast.variant === 'destructive' 
              ? 'bg-red-500/90 border-red-600 text-white' 
              : 'bg-white/90 border-gray-200 text-gray-900'
            }
          `}
        >
          {toast.title && (
            <div className="font-semibold mb-1">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export { Toaster };
