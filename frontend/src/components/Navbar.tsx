import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import NotificationBadge from './NotificationBadge';

const Navbar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    CV Generator
                </Typography>
                <Box>
                    <NotificationBadge />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 