import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div className={`toast-notification toast-${type}`}>
      <span className="toast-icon">{icons[type] || '🔔'}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} title="Dismiss">✕</button>
    </div>
  );
}
