export class Bill {
    id: string;
    createdDate: Date;
    reference: string;
    amount: number;
    paid: boolean
}

export class GroupedBills {
    bills: Bill[];
    date: Date;
}   