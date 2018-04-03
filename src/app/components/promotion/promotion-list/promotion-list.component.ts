import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PromotionService } from '../promotion.service';
import { Promotion } from '../promotion';
import { PagingResponse } from '../../../core/models/paging';

@Component({
    selector: 'app-promotion-list',
    styleUrls: [ './promotion-list.component.scss' ],
    templateUrl: './promotion-list.component.html'
})
export class PromotionListComponent implements OnInit {
    loading = false;
    promotions: PagingResponse<Promotion>;
    currentPage: number = 1;
    
    constructor(private service: PromotionService) { }

    ngOnInit() {
        this.loading = true;
        this.service
            .getAll()
            .subscribe(
                promotions => {
                    this.promotions = promotions;
                    this.loading = false;
                },
                err => { console.log(err); }
            );
    }

    pageChanged(page) {
        this.currentPage = page;
    }
}