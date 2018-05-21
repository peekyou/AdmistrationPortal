import { Lookup } from '../../../models/lookup';

export class Address {
    private static countriesCombineCityZipCode = ['fr'];
    private static countriesShowEmirateList = ['ae'];
    private static countriesShowCityList = ['sa'];
    private static countriesShowAreaList = ['ae','sa'];

    country?: Lookup;
    state?: string;
    city?: string;
    area?: string;
    zipCode?: string;
    addressLine1?: string;
    addressLine2?: string;
    latitude?: number;
    longitude?: number;

    public static isDefault(countryCode: string) {
        var combined = this.countriesCombineCityZipCode.concat(this.countriesShowAreaList).concat(this.countriesShowCityList).concat(this.countriesShowEmirateList);
        return combined.indexOf(countryCode) === -1;
    }

    public static showEmirate(countryCode: string) {
        return this.countriesShowEmirateList.indexOf(countryCode) > -1;
    }

    public static showCity(countryCode: string) {
        return this.countriesShowCityList.indexOf(countryCode) > -1;
    }

    public static showArea(countryCode: string) {
        return this.countriesShowAreaList.indexOf(countryCode) > -1;
    }

    public static combineCityZipCode(countryCode: string): boolean {
        return this.countriesCombineCityZipCode.indexOf(countryCode) > -1;
    }
}