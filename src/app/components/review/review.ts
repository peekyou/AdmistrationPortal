export class Review {
    id: string;
    createdDate: Date;
    createdBy: string;
    comment: string;
    rating1Label: string;
    rating1: number;
    rating2Label: string;
    rating2: number;
    rating3Label: string;
    rating3: number;
}

export class ReviewsAverage
{
    totalCount: number;
    rating1Label: string;
    rating1Average: number;
    rating2Label: string;
    rating2Average: number;
    rating3Label: string;
    rating3Average: number;
    allRatingsAverage: number
}