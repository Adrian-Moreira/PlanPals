import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface NotificationContextType {
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  setNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000); // 2 seconds for the notification display

      return () => clearTimeout(timer); // Cleanup on unmount or notification change
    }
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px', // Top-right corner
            right: '20px', // Align to the right
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: notification.type === 'success' ? 'rgb(51, 51, 153)' : 'red',
            color: 'white',
            zIndex: 9999, // Ensure it's on top of other UI elements
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Optional shadow for better visibility
          }}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
