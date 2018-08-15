export class User {
    id: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    lastLogin?: Date;
    status?: string;
    permissions: string[];
}

export class Permission {
    id: string;
    resourceKey: string;
    appwardsPackage?: number;
}

export class UserPreferences {
    userId: string;
    merchantsIds: string[];
    lang: string;
}