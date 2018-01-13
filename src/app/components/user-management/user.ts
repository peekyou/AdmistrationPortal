export class User {
    id: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    lastLogin?: Date;
    status?: string;
    permissions: string[];
}

export class Permission {
    id: string;
    resourceKey: string;
}