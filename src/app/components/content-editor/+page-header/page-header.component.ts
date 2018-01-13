import { Component, OnInit, Input, Output } from '@angular/core';
import { Page } from '../page'
import { PageNotifierService } from '../page-notifier.service';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    @Input() canCreate: boolean = false;
    @Input() page: Page;
    @Input() level: number;

    @Input() cssClass: string = '';
    @Input() numbering: string = '';
    
    constructor(private notifier: PageNotifierService) { }

    ngOnInit() { 
        if (!this.level) {
            this.level = 0;
        }
    }

    edit(): void {
        this.notifier.edit(this.page);
    }
}