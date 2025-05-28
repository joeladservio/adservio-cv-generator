export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'ERROR';
    createdAt: string;
    read: boolean;
    employee?: {
        id: number;
        firstName: string;
        lastName: string;
    };
} 