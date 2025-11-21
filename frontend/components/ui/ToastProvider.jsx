"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);
let message1id = 0;
let message2id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message) => {
    let id;
    if(message === "You are already enrolled in one or more of these classes") {
        id = ++message1id;
    }
    else {
        id = --message2id;
    }
    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
                className="bg-[#EF5350] px-4 py-2 rounded shadow text-white">
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
