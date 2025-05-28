import React from 'react';
import { Notification } from '../services/NotificationService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IconButton, ListItem, ListItemText, Typography } from '@mui/material';
import { Check as CheckIcon, Info as InfoIcon, Warning as WarningIcon, Error as ErrorIcon } from '@mui/icons-material';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'INFO':
                return <InfoIcon color="info" />;
            case 'WARNING':
                return <WarningIcon color="warning" />;
            case 'ERROR':
                return <ErrorIcon color="error" />;
            default:
                return <InfoIcon color="info" />;
        }
    };

    const formattedDate = format(new Date(notification.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr });

    return (
        <ListItem
            sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                borderRadius: 1,
                mb: 1,
            }}
            secondaryAction={
                !notification.read && (
                    <IconButton 
                        edge="end" 
                        aria-label="mark as read"
                        onClick={() => onMarkAsRead(notification.id)}
                    >
                        <CheckIcon />
                    </IconButton>
                )
            }
        >
            {getIcon()}
            <ListItemText
                sx={{ ml: 2 }}
                primary={notification.message}
                secondary={
                    <Typography variant="caption" color="text.secondary">
                        {formattedDate}
                    </Typography>
                }
            />
        </ListItem>
    );
};

export default NotificationItem; 