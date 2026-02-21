import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, XCircle, Clock } from 'lucide-react';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Mission Completed',
      message: 'Vehicle VH-001 successfully completed delivery to Warehouse A',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Fuel Level Low',
      message: 'Vehicle VH-003 fuel level below 20%',
      time: '15 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'alert',
      title: 'Maintenance Required',
      message: 'Vehicle VH-004 requires immediate maintenance',
      time: '1 hour ago',
      read: false
    },
    {
      id: 4,
      type: 'info',
      title: 'Route Update',
      message: 'New optimal route calculated for Vehicle VH-002',
      time: '2 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'success',
      title: 'Driver Login',
      message: 'Driver Sarah Johnson logged into system',
      time: '3 hours ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-success" />;
      case 'warning': return <AlertTriangle size={16} className="text-warning" />;
      case 'alert': return <XCircle size={16} className="text-danger" />;
      case 'info': return <Info size={16} className="text-primary" />;
      default: return <Bell size={16} className="text-text-muted" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-success/30 bg-success/10';
      case 'warning': return 'border-warning/30 bg-warning/10';
      case 'alert': return 'border-danger/30 bg-danger/10';
      case 'info': return 'border-primary/30 bg-primary/10';
      default: return 'border-border bg-surface';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomNotification = {
        id: Date.now(),
        type: ['success', 'warning', 'info'][Math.floor(Math.random() * 3)],
        title: 'System Update',
        message: 'Fleet system operating normally',
        time: 'Just now',
        read: false
      };
      
      if (Math.random() > 0.8) { // 20% chance every 10 seconds
        setNotifications(prev => [randomNotification, ...prev.slice(0, 9)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-lg transition-all duration-200"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-surface">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          {/* Notification Panel */}
          <div className="absolute right-0 top-12 w-96 bg-surface border border-border rounded-xl shadow-2xl z-50 max-h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-primary-alt transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface-elevated rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={48} className="text-text-muted mx-auto mb-4" />
                  <p className="text-text-secondary">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-surface-elevated transition-colors cursor-pointer ${
                        !notification.read ? 'bg-surface-elevated/50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg border ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-text-primary text-sm">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearNotification(notification.id);
                              }}
                              className="p-1 hover:bg-surface rounded transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
                            >
                              <X size={12} className="text-text-muted" />
                            </button>
                          </div>
                          <p className="text-xs text-text-secondary mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Clock size={12} />
                            <span>{notification.time}</span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border">
                <button
                  onClick={clearAll}
                  className="w-full py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  Clear All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
