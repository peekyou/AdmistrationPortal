import { Routes } from '@angular/router';

import { SponsorComponent } from './sponsor.component';

export const routes: Routes = [
    {
        path: 'sponsorship', children: [
            { path: '', component: SponsorComponent }
        ]
    },
];