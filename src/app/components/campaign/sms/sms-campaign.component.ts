import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import { UserService } from '../../user/user.service';
import { PackService } from '../pack/pack.service';
import { PackPurchaseModal } from '../pack/pack-purchase.modal';

@Component({
    styleUrls: ['./sms-campaign.component.scss'],
    templateUrl: './sms-campaign.component.html'
})
export class SmsCampaignComponent implements OnInit {
    quota: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private packService: PackService,
        public user: UserService) {

        this.packService.getSmsQuota()
        .subscribe(
            res => this.quota = res,
            err => console.log(err)
        );
    }
    
    public ngOnInit() {
        this.route.queryParams
            .switchMap(params => {
                var payment = params['payment'];
                var packCount = params['c'];
                if (payment == 's' && packCount) {
                    return Observable.of(packCount);
                }
                return Observable.of(0);
            })
            .subscribe(count => {
                if (count > 0) {
                    this.packService.buySmsPack(count)
                        .subscribe(
                            res => this.quota += res,
                            err => console.log(err)
                        );
                }
            },
            err => { });
    }

    openSmsPackModal() {
        const modalRef = this.modalService.open(PackPurchaseModal);
        modalRef.componentInstance.quota = this.quota;
        modalRef.componentInstance.type = 'sms';
    }
}