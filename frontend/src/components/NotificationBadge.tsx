import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Popover } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import NotificationList from './NotificationList';
import NotificationService from '../services/NotificationService';

const NotificationBadge: React.FC = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const fetchUnreadCount = async () => {
        try {
            const notifications = await NotificationService.getUnreadNotifications();
            setUnreadCount(notifications.length);
        } catch (err) {
            console.error('Error fetching unread notifications:', err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        // Rafraîchir le compteur toutes les 30 secondes
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        // Rafraîchir le compteur après la fermeture du popover
        fetchUnreadCount();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                aria-label={`${unreadCount} notifications non lues`}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 400,
                        maxHeight: 500,
                    },
                }}
            >
                <NotificationList />
            </Popover>
        </>
    );
};

export default NotificationBadge; 