import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PromotionService } from '../promotion.service';
import { Promotion } from '../promotion';
import { PagingResponse } from '../../../../core/models/paging';

@Component({
    selector: 'app-promotion-list',
    styleUrls: [ './promotion-list.component.scss' ],
    templateUrl: './promotion-list.component.html'
})
export class PromotionListComponent implements OnInit {
    loading = false;
    _reload: boolean;
    promotions: PagingResponse<Promotion>;
    currentPage: number = 1;

    @Input() itemsPerPage: number = 10;
    @Input() campaignType: string;

    @Input() 
    set reload(reload: boolean) {
        this._reload = reload;
        if (this._reload) {
            this.getPromotionsPage();
            this._reload = false;
        }
    }
    get data(): boolean {
        return this._reload;
    }
    
    constructor(private service: PromotionService) { }

    ngOnInit() {
        this.getPromotionsPage();
    }
    
    getPromotionsPage() {
        this.loading = true;
        this.service
            .get(this.campaignType, this.currentPage, this.itemsPerPage)
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
        this.getPromotionsPage();
    }
}