import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PromotionService } from './promotion.service';
import { Promotion } from './promotion';
import { PagingResponse } from '../../core/models/paging';

@Component({
    selector: 'promotion',
    styleUrls: [ './promotion.component.scss' ],
    templateUrl: './promotion.component.html'
})
export class PromotionComponent implements OnInit {
    loading = false;
    promotions: PagingResponse<Promotion>;

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

    onScroll() {
        console.log('Scroll');
    }
}
