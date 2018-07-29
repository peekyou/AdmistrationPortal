import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { UserService } from '../../../../components/user/user.service';
import { TranslationService } from '../../../services/translation.service';
import { LockService } from './lock.service';
import { AppModal } from '../../modals/modal';
import { AppwardsPackage } from '../../../models/appwardsPackage';

@Component({
    selector: 'app-lock',
    styleUrls: ['./lock.component.scss'],
    templateUrl: './lock.component.html'
})
export class LockComponent {
    packages: AppwardsPackage[] = [];
    currency: string;
    modalTitle: string;
    modalSentenceSilver: string;
    modalSentenceGold: string;
    modalConfirmation: string;
    loading: boolean;

    @Input() package: number;

    constructor(
        private modalService: NgbModal, 
        private service: LockService,
        private translation: TranslationService,
        private router: Router,
        public user: UserService) {

            this.user.getPackagesPrice().subscribe(res => this.packages = res);
            this.currency = user.getCurrency();
            this.translation.getMultiple([
                'PACKAGES.SUSCRIBE',
                'PACKAGES.MODAL_SILVER',
                'PACKAGES.MODAL_GOLD',
                'COMMON.CONFIRMATION_QUESTION'], x => {
                    this.modalTitle = x['PACKAGES.SUSCRIBE'];
                    this.modalSentenceSilver = x['PACKAGES.MODAL_SILVER'];
                    this.modalSentenceGold = x['PACKAGES.MODAL_GOLD'];
                    this.modalConfirmation = x['COMMON.CONFIRMATION_QUESTION'];
            });
    }

    openModal() {
        var modalSentence = this.package == 2 ? this.modalSentenceSilver : this.modalSentenceGold;
        var p = this.packages.find(o => o.id == this.package);
        var price = p ? p.price : '';

        const modalRef = this.modalService.open(AppModal);
        modalRef.componentInstance.title = this.modalTitle;
        modalRef.componentInstance.text1 = modalSentence.replace('{{price}}', price.toString()).replace('{{currency}}', this.currency);
        modalRef.componentInstance.text2 = this.modalConfirmation;
        
        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.loading = true;
                this.service.upgradePackage(this.package)
                    .subscribe(
                        res => {
                            this.loading = false;
                            this.user.logout();
                            this.router.navigate(['/login']);
                        },
                        err => {
                            this.loading = false;
                            console.log(err);
                    });
            }
        }, (reason) => { });
    }
}