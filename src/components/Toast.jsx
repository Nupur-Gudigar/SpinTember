// src/components/Toast.js
import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, show, onClose, type = "info" }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000); // auto-close after 3s
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return show ? <div className={`toast toast-${type}`}>{message}</div> : null;
};

export default Toast;
