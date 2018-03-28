import { Routes } from '@angular/router';

import { ContentEditorComponent } from './components/content-editor/content-editor.component';
import { AboutComponent } from './components/about';
import { NoContentComponent } from './components/no-content';

import { DataResolver } from './app.resolver';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'auth', loadChildren: './components/user#UserModule' },
    { path: 'customers', loadChildren: './components/customer#CustomerModule' },
    { path: 'content', loadChildren: './components/content-editor#ContentEditorModule' },
    { path: 'promotions', loadChildren: './components/promotion#PromotionModule'},
    { path: 'reviews', loadChildren: './components/review#ReviewModule' },
    { path: 'mobile-preview', loadChildren: './components/mobile-preview#MobilePreviewModule' },
    { path: 'sms', loadChildren: './components/sms#SmsModule' },
    { path: 'billing', loadChildren: './components/billing#BillingModule' },
    { path: 'dashboard', loadChildren: './components/stats#StatsModule' },
    { path: 'about', component: AboutComponent },
    { path: '**',    component: NoContentComponent }
];