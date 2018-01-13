import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Page } from './page';

@Injectable()
export class PageNotifierService {
    onEditSource = new Subject<Page>();
    onCreateSource = new Subject<Page>();
    
    edit(page: Page) {
        this.onEditSource.next(page);
    }

    create(parentPage: Page) {
        this.onCreateSource.next(parentPage);
    }
}