import { useState, useCallback } from 'react';

let toastId = 0;
const listeners = new Set();
const toasts = [];

const addToast = (toast) => {
  const id = toastId++;
  const newToast = { ...toast, id };
  toasts.push(newToast);
  listeners.forEach((listener) => listener([...toasts]));
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
      listeners.forEach((listener) => listener([...toasts]));
    }
  }, 5000);
};

const removeToast = (id) => {
  const index = toasts.findIndex((t) => t.id === id);
  if (index !== -1) {
    toasts.splice(index, 1);
    listeners.forEach((listener) => listener([...toasts]));
  }
};

export const useToast = () => {
  const [localToasts, setLocalToasts] = useState([...toasts]);
  
  useState(() => {
    listeners.add(setLocalToasts);
    return () => listeners.delete(setLocalToasts);
  }, []);
  
  const toast = useCallback((toast) => {
    addToast(toast);
  }, []);
  
  return {
    toast,
    toasts: localToasts,
    removeToast,
  };
};

export const toast = addToast;
