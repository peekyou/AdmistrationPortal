import { Component, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';

import { NotificationService } from './notification.service';

@Component({
    selector: 'app-notifications',
    styleUrls: ['./notifications.component.scss'],
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent {
    constructor(public service: NotificationService) {
    }
}