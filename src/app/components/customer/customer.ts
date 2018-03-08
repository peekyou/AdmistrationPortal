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
    points?: CustomerPoint[];
    discountAmount?: number;
    purchaseData?: PurchaseData;
    languages?: Lookup[];
    address?: Address; 
}

export class PurchaseData {
    totalPurchaseAmount?: number;
    currentPurchaseAmount?: number;
    totalPurchaseAmountString?: string;
    currentPurchaseAmountString?: string;
    remainder?: number;
}

export class CustomerExpense {
    id?: string;
    date: Date;
    amount: number;
}

export class CustomerPoint {
    id?: string;
    date: Date;
    correspondingAmount: number;
    remainder?: number;
    isRedeemed?: boolean;
    currency?: string;
}

export class CustomerFilter {
    hasApplication?: boolean;
}