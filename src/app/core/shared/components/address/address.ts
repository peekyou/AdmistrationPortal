import { Lookup } from '../../../models/lookup';

export class Address {
    country?: Lookup;
    state?: string;
    city?: string;
    area?: string;
    zipCode?: string;
    addressLine1?: string;
    addressLine2?: string;
    latitude?: number;
    longitude?: number;
}