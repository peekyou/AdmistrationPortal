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
    smsSent?: number;
    filter?: PromotionFilter;

    constructor() {
        this.filter = new PromotionFilter();
    }
}

export class PromotionFilter {
    customerName: string;
    currentPointsMin: number;
    currentPointsMax: number;
    cumulatedPointsMin: number;
    cumulatedPointsMax: number;
    purchaseAmountMin: number;
    purchaseAmountMax: number;
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
            customerName: form.customerName,
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