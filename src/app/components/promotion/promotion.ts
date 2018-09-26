import { ngbDateStructToDate } from '../../core/helpers/utils';
import { CustomerCustomFields } from '../../core/models/customerCustomFields';

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
    nbRecipients?: number;
    filter?: PromotionFilter;
    promotionType?: string;

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
    location: string[];
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;

    static createFromForm(form: any): PromotionFilter {
        if (!form) return null;
        return {
            cumulatedPointsMax: form.cumulatedPointsMax,
            cumulatedPointsMin: form.cumulatedPointsMin,
            currentPointsMax: form.currentPointsMax,
            currentPointsMin: form.currentPointsMin,
            customerId: form.customerName,
            customerGender: PromotionFilter.getGenderFilter(form.customerGenderMale, form.customerGenderFemale),
            customerAgeFrom: form.customerAgeFrom,
            customerAgeTo: form.customerAgeTo,
            customerSince: ngbDateStructToDate(form.customerSince),
            didntReceivePromotionId: form.didntReceivePromotion,
            lastEntryFrom: ngbDateStructToDate(form.lastEntryFrom),
            lastEntryTo: ngbDateStructToDate(form.lastEntryTo),
            purchaseAmountMax: form.purchaseAmountMax,
            purchaseAmountMin: form.purchaseAmountMin,
            receivedPromotionId: form.receivedPromotion,
            location: form.location,
            customField1: CustomerCustomFields.getValue(form.customField1),
            customField2: CustomerCustomFields.getValue(form.customField2),
            customField3: CustomerCustomFields.getValue(form.customField3),
            customField4: CustomerCustomFields.getValue(form.customField4)
        };
    }

    private static getGenderFilter(maleFilter: boolean, femaleFilter: boolean): string {
        var genderFilter: string = '';
        if (maleFilter === true) genderFilter += 'M';
        if (femaleFilter === true) genderFilter += 'F';
        if (maleFilter === false && femaleFilter === false) genderFilter = null;
        return genderFilter;
    }
}