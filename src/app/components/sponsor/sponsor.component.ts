import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { TranslationService } from '../../core/services/translation.service';
import { SponsorService } from './sponsor.service';
import { UserService } from '../user/user.service';
import { AppModal } from '../../core/shared/modals/modal';
import { SponsorOffer, Sponsoree } from './sponsor';

@Component({
    styleUrls: ['./sponsor.component.scss'],
    templateUrl: './sponsor.component.html'
})
export class SponsorComponent implements OnInit {
    error: boolean;
    loading: boolean;
    modalTitle: string;
    modalSentence: string;
    modalConfirmation: string;
    offer: SponsorOffer;
    currency: string;
    form: FormGroup;
    submitSubscription: Subscription;
    sponsorees: Sponsoree[] = [];

    constructor(
        private fb: FormBuilder, 
        private service: SponsorService,
        private modalService: NgbModal,
        private translation: TranslationService,
        public user: UserService) {

        this.currency = user.getCurrency();
        this.getSponsorOffer();
        this.getSponsorees();
        this.translation.getMultiple([
            'SPONSOR.TITLE',
            'SPONSOR.MODAL_SENTENCE'], x => {
                this.modalTitle = x['SPONSOR.TITLE'];
                this.modalSentence = x['SPONSOR.MODAL_SENTENCE'];
                this.modalConfirmation = null;
        });
    }

    public ngOnInit() {
        this.init();
    }

    init() {
        this.form = this.fb.group({
            fullname: [null, Validators.required],
            companyName: [null, Validators.required],
            email: [null, Validators.email]
        });
    }

    getSponsorOffer() {
        this.service.getSponsorOffer()
            .subscribe(
                res => {
                    this.offer = res;
                },
                err => console.log(err)
            )
    }

    getSponsorees() {
        this.loading = true;
        this.service.getSponsores()
            .subscribe(
                res => {
                    this.loading = false;
                    this.sponsorees = res;
                },
                err =>  {
                    this.loading = false;
                    console.log(err);
                }
            )
    }

    openModal() {
        const modalRef = this.modalService.open(AppModal);
        modalRef.componentInstance.title = this.modalTitle;
        modalRef.componentInstance.text1 = this.modalSentence;
        modalRef.componentInstance.text2 = this.modalConfirmation;
        
        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.submitSubscription = this.service.sponsor({ 
                    name: this.fullname.value,
                    companyName: this.companyName.value,
                    email: this.email.value
                })
                .subscribe(
                    res => { 
                        this.sponsorees.unshift(res);
                        this.form.reset();
                        this.error = false;
                    },
                    err => {
                        this.error = true;
                        console.log(err);
                    }
                );
            }
        }, (reason) => { });
    }
    
    get fullname() { return this.form.get('fullname'); }
    get companyName() { return this.form.get('companyName'); }
    get email() { return this.form.get('email'); }
}