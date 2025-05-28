import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-item',
  template: `
    <div class="notification-item p-3 border-bottom" 
         [class.unread]="!notification.read"
         (click)="onNotificationClick()">
      <div class="d-flex align-items-start">
        <div [class]="'notification-icon ' + getIconClass()">
          <i [class]="getIconName()"></i>
        </div>
        <div class="ms-3 flex-grow-1">
          <h6 class="mb-1">{{ notification.title }}</h6>
          <p class="mb-1 text-muted">{{ notification.message }}</p>
          <small class="text-muted">
            {{ notification.createdAt | date:'dd/MM/yyyy HH:mm' }}
          </small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-item {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .notification-item:hover {
      background-color: var(--bs-light);
    }
    .notification-item.unread {
      background-color: rgba(var(--bs-primary-rgb), 0.05);
    }
    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .notification-icon.info {
      background-color: rgba(var(--bs-info-rgb), 0.1);
      color: var(--bs-info);
    }
    .notification-icon.warning {
      background-color: rgba(var(--bs-warning-rgb), 0.1);
      color: var(--bs-warning);
    }
    .notification-icon.error {
      background-color: rgba(var(--bs-danger-rgb), 0.1);
      color: var(--bs-danger);
    }
  `]
})
export class NotificationItemComponent {
  @Input() notification!: Notification;
  @Output() read = new EventEmitter<number>();

  onNotificationClick(): void {
    if (!this.notification.read) {
      this.read.emit(this.notification.id);
    }
  }

  getIconClass(): string {
    switch (this.notification.type) {
      case 'INFO':
        return 'info';
      case 'WARNING':
        return 'warning';
      case 'ERROR':
        return 'error';
      default:
        return 'info';
    }
  }

  getIconName(): string {
    switch (this.notification.type) {
      case 'INFO':
        return 'bi bi-info-circle';
      case 'WARNING':
        return 'bi bi-exclamation-triangle';
      case 'ERROR':
        return 'bi bi-x-circle';
      default:
        return 'bi bi-info-circle';
    }
  }
} 