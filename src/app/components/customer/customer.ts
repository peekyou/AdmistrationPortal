export class Customer {
    id?: string;
    cardNumber?: string;
    firstname: string;
    lastname: string;
    email?: string;
    birthdate?: Date;
    mobileNumber: string;
    firstEntry?: Date;
    lastEntry?: Date;
    comment?: string;
    //receiveSms?: boolean;
    currentPoints?: number;
    totalPoints?: number;
    expenses?: CustomerExpense[];
    points?: CustomerPoint[];
    purchaseData?: PurchaseData;
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
    createdDate: Date;
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