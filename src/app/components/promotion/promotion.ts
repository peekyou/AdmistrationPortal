import { ngbDateStructToDate } from '../../core/helpers/utils';

export class Promotion {
    id?: string;
    name: string;
    status?: string;
    createdDate?: Date;
    fromDate?: Date;
    toDate?: Date;
    percentage?: number;
    details?: string;
    nbSmsSent?: number;
    filter?: PromotionFilter;

    constructor() {
        this.filter = new PromotionFilter();
    }
}

export class PromotionFilter {
    customerId: string;
    currentPointsMin: number;
    currentPointsMax: number;
    cumulatedPointsMin: number;
    cumulatedPointsMax: number;
    purchaseAmountMin: number;
    purchaseAmountMax: number;
    customerGender: string;
    customerAgeFrom: number;
    customerAgeTo: number;
    customerSince: Date;
    lastEntryFrom: Date;
    lastEntryTo: Date;
    receivedPromotionId: string;
    didntReceivePromotionId: string;

    static createFromForm(form: any): PromotionFilter {
        if (!form) return null;
        return {
            cumulatedPointsMax: form.cumulatedPointsMax,
            cumulatedPointsMin: form.cumulatedPointsMin,
            currentPointsMax: form.currentPointsMax,
            currentPointsMin: form.currentPointsMin,
            customerId: form.customerName,
            customerGender: form.customerGender == 'U' ? null : form.customerGender,
            customerAgeFrom: form.customerAgeFrom,
            customerAgeTo: form.customerAgeTo,
            customerSince: ngbDateStructToDate(form.customerSince),
            didntReceivePromotionId: form.didntReceivePromotion,
            lastEntryFrom: ngbDateStructToDate(form.lastEntryFrom),
            lastEntryTo: ngbDateStructToDate(form.lastEntryTo),
            purchaseAmountMax: form.purchaseAmountMax,
            purchaseAmountMin: form.purchaseAmountMin,
            receivedPromotionId: form.receivedPromotion
        };
    }
}