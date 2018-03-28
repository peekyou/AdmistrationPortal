import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MobilePreviewService } from './mobile-preview.service';

@Component({
    selector: 'app-mobile-preview',
    styleUrls: ['./mobile-preview.component.scss'],
    templateUrl: './mobile-preview.component.html'
})
export class MobilePreviewComponent {
    devices: any[];
    selectedDevice: any;
    applicationUrl: string;

    private myTemplate: any = "";
    constructor(public service: MobilePreviewService) {
        // service.getApplicationHTML(this.applicationUrl)
        // .subscribe((html:any) => this.myTemplate = html)
        service.getApplicationUrl()
               .subscribe(url => this.applicationUrl = url,
                err => console.log(err)
            )

        this.devices = [
            { id: 'iphone5S', name: 'iPhone 5', width: 320, height: 568, top: '138px', left: '73px' },
            { id: 'iphone6', name: 'iPhone 6', width: 365, height: 650, top: '115px', left: '51px' },
            //{ id: '2', name: 'iPhone 6 Plus', width: 414, height: 736 },
            { id: 'galaxy-s5', name: 'Galaxy S5', width: 360, height: 640, top: '96px', left: '56px' },
            //{ id: '3', name: 'Nexus 6P', width: 412, height: 732 }
        ];
        this.selectedDevice = this.devices[0];
    }

    onDeviceChange(device) {
        this.selectedDevice = device;
    }
}
