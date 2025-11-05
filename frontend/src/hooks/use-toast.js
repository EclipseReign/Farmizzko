import { useState, useEffect } from 'react';

const toasts = [];
let listeners = [];

export function toast({ title, description, variant = 'default' }) {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast = { id, title, description, variant };
  toasts.push(newToast);
  listeners.forEach(listener => listener([...toasts]));
  
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      listeners.forEach(listener => listener([...toasts]));
    }
  }, 3000);
}

export function useToast() {
  const [toastList, setToastList] = useState([...toasts]);
  
  useEffect(() => {
    listeners.push(setToastList);
    return () => {
      listeners = listeners.filter(l => l !== setToastList);
    };
  }, []);
  
  return { toasts: toastList, toast };
}
