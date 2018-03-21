import { Component, AfterViewInit, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
// import { TreeviewItem } from 'ngx-treeview';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../user/user.service';
import { UserPreferences } from '../../user/user';

@Component({
    selector: 'app-user-popover',
    templateUrl: './user-popover.component.html',
    styleUrls: ['./user-popover.component.scss']
})
export class UserPopoverComponent implements AfterViewInit {
    userPrefSubscription: Subscription;
    userPreferences: UserPreferences = new UserPreferences();
    merchantsTreeConfig = {
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 500
    };
    // merchants: TreeviewItem[] = [];

    private parentNode: any;
    @Output() private closeEvent: EventEmitter<void> = new EventEmitter();
   
     constructor(private _element: ElementRef, public user: UserService) { 
        //  var hierarchy =  user.getMerchantHierarchy();
        //  if (hierarchy) {
        //     this.init(hierarchy);
        //  }
     }
   
     ngAfterViewInit(): void {
        this.parentNode = this._element.nativeElement.parentNode;
     }
   
     @HostListener('document:click', ['$event.path'])
     onClickOutside($event: Array<any>) {
        const elementRefInPath = $event.find(node => node === this.parentNode);
        if (!elementRefInPath) {
            this.closeEvent.emit();
        }
    }

    close() {
        this.closeEvent.emit();
    }

    onMerchantSelected(merchants) {
        this.userPreferences.merchantsIds = merchants;
    }

    init() {
        this.user
            .getPreferences(this.user.getUserId())
            .subscribe(
                result => {
                    this.userPreferences = result;
                    // this.merchants = this.buildTree(hierarchy);
                },
                err => { console.log(err); }
            );
    }

    savePreferences() {
        this.userPrefSubscription = this.user
            .savePreferences(this.userPreferences)
            .subscribe(
                result => {},
                err => { console.log(err); }
            );
    }
    
    // buildTree(merchant: MerchantHierarchy): TreeviewItem[] {
    //     var children: TreeviewItem[] = []
    //     if (merchant && merchant.children) {

    //         merchant.children.forEach(x => children.push(new TreeviewItem({
    //             text: x.merchantName,
    //             value: x.merchantId,
    //             checked: !this.userPreferences || !this.userPreferences.merchantsIds || this.userPreferences.merchantsIds.indexOf(x.merchantId) > -1,
    //             children: this.buildTree(x)
    //         })));
    //     }
    //     return children;
    // }

    logout() {
        this.close();
        this.user.logout();
    }
}