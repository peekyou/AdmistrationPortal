import { Component, OnInit, Input, Output } from '@angular/core';
import { Page } from '../page'
import { PageNotifierService } from '../page-notifier.service';

@Component({
    selector: 'app-page-create',
    templateUrl: './page-create.component.html',
    styleUrls: ['./page-create.component.scss']
})
export class PageCreateComponent implements OnInit {
    @Input() page: Page;
    @Input() level: number;
    @Input() numbering: string = '';
    
    constructor(private notifier: PageNotifierService) { }

    ngOnInit() { 
        if (!this.level) {
            this.level = 0;
        }
    }
    
    create() {
        this.notifier.create(this.page);
    }
}