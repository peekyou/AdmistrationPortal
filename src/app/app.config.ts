import { ApplicationRef, enableProdMode, InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export function appConfigFactory(): AppConfig {
    return <AppConfig>window['AppConfig'];
}

export interface AppConfig {
    ApiEndpoint: string;
    GroupId: string;
    //public static API_ENDPOINT = 'http://api.app-wards.com/SoAppService.svc/json';
    // public static MerchantId = '193DDF9621C3494FBDF84F01D181DE58'; // Test
    Lang: string;
    
    // public static MerchantId = '2E5D3ECD37A34E6E971987F836CBFEB6';
    // public static MerchantName = 'Golden Age';

    // public static MerchantId = '5BB4440235104747AE5E7EBD5CFBA5FD';
    // public static MerchantName = 'Test Design';
    
}