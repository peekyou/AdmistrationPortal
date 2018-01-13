import { Routes } from '@angular/router';

import { MobilePreviewComponent } from './mobile-preview.component';
import { AuthGuard } from '../../guards/auth.guard';

export const routes: Routes = [
    {
        path: 'mobile-preview', canActivate: [AuthGuard], children: [
            { path: '', component: MobilePreviewComponent }
        ]
    },
];