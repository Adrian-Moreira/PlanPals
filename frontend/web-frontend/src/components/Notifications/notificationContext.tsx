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
      }, 2000); // 20 seconds

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
            bottom: '20px',
            right: '20px',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: notification.type === 'success' ? 'green' : 'red',
            color: 'white',
          }}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
