export class LoyaltyProgram {
    $type: string;
    id: string;
}

export class LoyaltyProgramPoints extends LoyaltyProgram {
    loyaltyFunction: string;
    rewards: LoyaltyProgramPointsReward[];
}

export class LoyaltyProgramBuyGetFree extends LoyaltyProgram {
    productName: string;
    threshold: number;
}

export class LoyaltyProgramBirthday extends LoyaltyProgram {
    gift: string;
}

export class LoyaltyProgramPointsReward {
    id: string;
    amount: number;
    pointsThreshold: number;
    reward: string;
}