import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface Notification {
    id: number;
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

class NotificationService {
    private readonly baseUrl = `${API_BASE_URL}/notifications`;

    async getNotificationsForEmployee(employeeId: number): Promise<Notification[]> {
        const response = await axios.get(`${this.baseUrl}/employee/${employeeId}`);
        return response.data;
    }

    async getUnreadNotifications(): Promise<Notification[]> {
        const response = await axios.get(`${this.baseUrl}/unread`);
        return response.data;
    }

    async markAsRead(notificationId: number): Promise<void> {
        await axios.put(`${this.baseUrl}/${notificationId}/mark-read`);
    }

    async markAllAsReadForEmployee(employeeId: number): Promise<void> {
        await axios.put(`${this.baseUrl}/employee/${employeeId}/mark-all-read`);
    }
}

export default new NotificationService(); 