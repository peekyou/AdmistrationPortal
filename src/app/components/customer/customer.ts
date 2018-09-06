import { Address } from '../../core/shared/components/address/address'; 
import { Lookup } from '../../core/models/lookup';

export class Customer {
    id?: string;
    cardNumber?: string;
    gender?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    birthdate?: Date;
    mobileNumber?: string;
    firstEntry?: Date;
    lastEntry?: Date;
    comment?: string;
    //receiveSms?: boolean;
    currentPoints?: number;
    totalPoints?: number;
    expenses?: CustomerExpense[];
    totalExpenses?: CustomerExpense[];
    points?: CustomerPoint[];
    discountAmount?: number;
    pointsToDiscount?: number;
    purchaseData?: PurchaseData;
    languages?: Lookup[];
    favoriteProducts?: Lookup[];
    address?: Address; 
    customField1?: string;
    customField2?: string;
    customField3?: string;
    customField4?: string;
}

export class PurchaseData {
    currentPurchaseAmount?: number;
    currentPurchaseAmountString?: string;
    remainder?: number;
}

export class CustomerExpense {
    id?: string;
    date: Date;
    amount: number;
    correspondingPoints?: number;
    redeemedPoints?: number;
    isRedeemed?: boolean;
}

export class CustomerPoint {
    id?: string;
    date: Date;
    correspondingAmount: number;
    remainder?: number;
    isRedeemed?: boolean;
    currency?: string;
    expenseId?: string;
}

export class CustomerFilter {
    hasApplication?: boolean;
}