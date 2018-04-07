import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ReviewService } from './review.service';
import { Review, ReviewsAverage } from './review';
import { PagingResponse } from '../../core/models/paging';

@Component({
    selector: 'review',
    styleUrls: ['./review.component.scss'],
    templateUrl: './review.component.html'
})
export class ReviewComponent {
    loading = false;
    loadingAverage = false;
    reviews: PagingResponse<Review>;
    reviewsAverage: ReviewsAverage;

    constructor(private service: ReviewService) {
        this.loading = this.loadingAverage = true;

        this.service
            .getAll(1, 100)
            .subscribe(
                reviews => { 
                    this.reviews = reviews; 
                    this.loading = false;
                },
                err => { console.log(err); }
            );
            
        this.service.getAverage()
            .subscribe(
                res => {
                    this.reviewsAverage = res;
                    this.loadingAverage = false;
                },
                err => { console.log(err); }
            );
    }

    onScroll() {
        console.log('scrr');
    }
}