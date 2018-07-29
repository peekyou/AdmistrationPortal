import { Component, OnInit, Input, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import { Customer } from '../customer';
import { CustomerLoyaltyCardComponent } from './loyalty-card/loyalty-card.component';
import { CustomerExpensesComponent } from './expenses/expenses.component';
import { CustomerCurrentPointsComponent } from './current-points/current-points.component';
import { CustomerInfosComponent } from './customer-infos/customer-infos.component';

@Component({
    selector: 'app-dynamic-card',
    template: `
        <div>
        </div>
    `
})
export class DynamicCardComponent implements OnInit {
    @Input() index: number;
    @Input() customer: Customer = null;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef) {
    }

    ngOnInit() {
        var factory = null; 
        switch (this.index) {
            case 2:
                factory = this.componentFactoryResolver.resolveComponentFactory(CustomerCurrentPointsComponent);
                break;
            case 3:
                factory = this.componentFactoryResolver.resolveComponentFactory(CustomerExpensesComponent);
                break;
            case 4:
                factory = this.componentFactoryResolver.resolveComponentFactory(CustomerInfosComponent);
                break;
            case 1:
            default:    
                factory = this.componentFactoryResolver.resolveComponentFactory(CustomerLoyaltyCardComponent);
            
        }
        const ref = this.viewContainerRef.createComponent(factory);
        (<any>ref.instance).customer = this.customer;
        ref.changeDetectorRef.detectChanges();
    }
}