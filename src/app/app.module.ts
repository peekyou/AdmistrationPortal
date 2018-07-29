import { SharedModule } from './core/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DndModule } from 'ng2-dnd';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TreeviewModule } from 'ngx-treeview';
import { D3Service } from 'd3-ng2-service';
import { LoadingModule } from 'ngx-loading';
import { AgmCoreModule } from '@agm/core';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { APP_PROVIDERS } from './app.providers';
import { AppState, InternalStateType } from './app.service';
import { HeaderModule } from './components/header';
import { SidebarModule } from './components/sidebar';
import { UserModule } from './components/user';
import { CustomerModule } from './components/customer';
import { ContentEditorModule } from './components/content-editor';
import { PromotionModule } from './components/promotion';
import { ReviewModule } from './components/review';
import { SmsModule } from './components/sms';
import { EmailCampaignModule } from './components/email-campaign';
import { BillingModule } from './components/billing';
import { BackOfficeManagementModule } from './components/bo-management'
import { MobilePreviewModule } from './components/mobile-preview';
import { StatsModule } from './components/stats';
import { AboutComponent } from './components/about';
import { NoContentComponent } from './components/no-content';
import { routes } from './app.routes';

import '../styles/styles.scss';

// Application wide providers
const PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    ...APP_PROVIDERS,
    D3Service,
    AppState
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/assets/lang/", "-v6.json");
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        AboutComponent,
        NoContentComponent
    ],
    /**
    * Import modules.
    */
    imports: [
        NgbModule.forRoot(),
        DndModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        LoadingModule.forRoot({
            primaryColour: '#0F4676', 
            secondaryColour: '#0F4676', 
            tertiaryColour: '#0F4676'
        }),
        TreeviewModule.forRoot(),
        BrowserModule,
        SharedModule,
        HeaderModule,
        SidebarModule,
        CustomerModule,
        ContentEditorModule,
        PromotionModule,
        ReviewModule,
        SmsModule,
        EmailCampaignModule,
        BillingModule,
        MobilePreviewModule,
        BackOfficeManagementModule,
        UserModule,
        StatsModule,
        AgmCoreModule.forRoot({ 
            apiKey: 'AIzaSyD2tHPV7C3ehD5O6CFPryF94GJfwj9ARoc',
            libraries: ["places"]
        }),
        RouterModule.forRoot(routes, { 
            preloadingStrategy: PreloadAllModules, 
            useHash: Boolean(history.pushState) === false 
        })
    ],
    /**
    * Expose our Services and Providers into Angular's dependency injection.
    */
    providers: [
        ENV_PROVIDERS,
        PROVIDERS
    ]
})
export class AppModule {}
