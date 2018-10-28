
export class SponsorOffer {
    sponsorGain: number;
    sponsoreeGain: number;
}

export class Sponsoree {
    createdDate?: Date;
    expiryDate?: Date;
    name: string;
    companyName: string;
    email: string;
    successful?: boolean;
}