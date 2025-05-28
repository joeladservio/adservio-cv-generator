import React, { useEffect, useState } from 'react';
import { List, Paper, Typography, Button, Box, CircularProgress } from '@mui/material';
import NotificationItem from './NotificationItem';
import NotificationService, { Notification } from '../services/NotificationService';

interface NotificationListProps {
    employeeId?: number;
}

const NotificationList: React.FC<NotificationListProps> = ({ employeeId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = employeeId
                ? await NotificationService.getNotificationsForEmployee(employeeId)
                : await NotificationService.getUnreadNotifications();
            setNotifications(data);
        } catch (err) {
            setError('Erreur lors du chargement des notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Rafraîchir les notifications toutes les 30 secondes
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [employeeId]);

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await NotificationService.markAsRead(notificationId);
            setNotifications(notifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            ));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!employeeId) return;
        try {
            await NotificationService.markAllAsReadForEmployee(employeeId);
            setNotifications(notifications.map(notification => ({
                ...notification,
                read: true
            })));
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                    Notifications {notifications.length > 0 ? `(${notifications.length})` : ''}
                </Typography>
                {employeeId && notifications.some(n => !n.read) && (
                    <Button 
                        variant="outlined" 
                        size="small"
                        onClick={handleMarkAllAsRead}
                    >
                        Tout marquer comme lu
                    </Button>
                )}
            </Box>
            {notifications.length === 0 ? (
                <Typography color="textSecondary" align="center">
                    Aucune notification
                </Typography>
            ) : (
                <List>
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default NotificationList; 