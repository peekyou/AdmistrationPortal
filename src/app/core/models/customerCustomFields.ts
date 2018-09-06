import { Lookup } from './lookup';

export class CustomerCustomFields {
    resourceKey: string;
    order: number;
    mandatory: boolean;
    multiselect: boolean;
    fieldType: string;
    valuesList: string[];

    static getValue(value: Lookup | string | string[] | boolean): string {
        if (Array.isArray(value)) {
            return value.join(';');
        }
        else if (typeof value === 'boolean') {
            return value.toString();
        }
        return Lookup.getValue(value);
    }

    static setValue(value: string): string | boolean {
        if (value && value.toLowerCase() === 'true') {
            return true;
        }
        else if (value && value.toLowerCase() === 'false') {
            return false;
        }
        return value;
    }
}