import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ReviewService } from './review.service';
import { Review } from './review';
import { PagingResponse } from '../../core/models/paging';

@Component({
    selector: 'review',
    styleUrls: ['./review.component.scss'],
    templateUrl: './review.component.html'
})
export class ReviewComponent {
    loading = false;
    reviews: PagingResponse<Review>;
    averageRating1: number = 0;
    averageRating2: number = 0;
    averageRating3: number = 0;

    constructor(private service: ReviewService) {
        this.loading = true;
        this.service
            .getAll(1, 100)
            .subscribe(
                reviews => { 
                    this.reviews = reviews; this.calculateAverage(); 
                    this.loading = false;
                },
                err => { console.log(err); }
            );
    }

    private calculateAverage() {
        if (this.reviews.paging.itemsCount > 0) {
            this.reviews.data.forEach(r => {
                this.averageRating1 += r.rating1;
                this.averageRating2 += r.rating2;
                this.averageRating3 += r.rating3;
            });
            this.averageRating1 /= this.reviews.paging.totalCount;
            this.averageRating2 /= this.reviews.paging.totalCount;
            this.averageRating3 /= this.reviews.paging.totalCount;
        }
    }
}