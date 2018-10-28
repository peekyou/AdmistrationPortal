import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { SponsorOffer, Sponsoree } from './sponsor';

@Injectable()

export class SponsorService {
    private api: string;

    constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: AuthHttpService) {
        this.api = config.ApiEndpoint + '/sponsorship';
    }

    getSponsorOffer(): Observable<SponsorOffer> {
        return this.http.get(this.api + '/offer');
    }

    getSponsores(): Observable<Sponsoree[]> {
        return this.http.get(this.api + '/sponsorees');
    }

    sponsor(sponsoree: Sponsoree): Observable<Sponsoree> {
        return this.http.post(this.api, sponsoree);
    }
}

