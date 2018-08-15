import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslationService } from '../../core/services/translation.service';
import { UserModal } from './user-modal/user.modal';
import { DeleteModal } from '../../core/shared/modals/delete.modal';
import { UserManagementService } from './user-management.service';
import { ProductService } from './product/product.service';
import { Product } from './product/product';
import { User, Permission } from '../user/user';
import { PagingResponse } from '../../core/models/paging';

@Component({
    styleUrls: [ './bo-management.component.scss' ],
    templateUrl: './bo-management.component.html'
})
export class BackOfficeManagementComponent {
    modalNewUserTitle: string;
    modalEditUserTitle: string;
    users: PagingResponse<User>;
    permissions: Permission[];
    loading = false;
    currentPage: number = 1;
    loadingProducts = false;

    products: PagingResponse<Product>;
    productForm: FormGroup;
    productCurrentPage: number = 1;
    saveProductSubscription;

    @Input() itemsPerPage: number = 10;

    constructor(
        private fb: FormBuilder,
        private service: UserManagementService, 
        private productService: ProductService,
        private modalService: NgbModal, 
        translation: TranslationService) {

        this.getUsersPage();
        this.service.getPermissions()
            .subscribe(
                res => this.permissions = res,
                err => console.log(err)
            );

        translation.getMultiple([
            'USER_MANAGEMENT.NEW',
            'USER_MANAGEMENT.EDIT'], x => {
                this.modalNewUserTitle = x['USER_MANAGEMENT.NEW'];
                this.modalEditUserTitle = x['USER_MANAGEMENT.EDIT'];
        });

        this.initProductForm();
        this.getProducts();
     }

     getUsersPage() {
        this.loading = true;
        this.service.getUsers(this.currentPage, this.itemsPerPage)
            .subscribe(
                users => {
                    this.users = users;
                    this.loading = false;
                },
                err => { console.log(err); }
            );
    }

    pageChanged(page) {
        this.currentPage = page;
        this.getUsersPage();
    }
    
    deleteUser(user: User) {
        this.service
            .deleteUser(user)
            .subscribe(
                r => {
                    var index = this.users.data.indexOf(user);
                    if (index > -1) {
                        this.users.data.splice(index, 1);
                        this.users.paging.totalCount--;
                    }
                },
                err => { console.log(err); }
            );
    }

    openUserModal(user: User = null) {
        const modalRef = this.modalService.open(UserModal, { 
            windowClass: 'user-modal',
        });
        modalRef.componentInstance.isEdit = user != null;
        modalRef.componentInstance.user = user;
        modalRef.componentInstance.title = user != null ? this.modalEditUserTitle : this.modalNewUserTitle;

        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.getUsersPage();
            }
        }, (reason) => { });
    }

    openDeleteModal(object: User | Product) {
        const modalRef = this.modalService.open(DeleteModal);
        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.deleteProduct(object);
            }
        });
    }

    // Products
    initProductForm() {
        this.productForm = this.fb.group({
            name: [null, Validators.required]
        });
    }

    createProduct() {
        var product: Product = {
            name: this.productForm.value.name
        };
        this.saveProductSubscription = this.productService
            .createProduct(product)
            .subscribe(
                r => this.getProducts(),
                err => { console.log(err); }
            );
    }

    getProducts() {
        this.loadingProducts = true;
        this.productService.getProducts(this.productCurrentPage, this.itemsPerPage)
            .subscribe(
                res => {
                    this.products = res;
                    this.loadingProducts = false;
                },
                err => { console.log(err); }
            );
    }

    deleteProduct(product: Product) {
        this.productService
            .deleteProduct(product)
            .subscribe(
                r => this.getProducts(),
                err => { console.log(err); }
            );
    }

    productsPageChanged(page) {
        this.productCurrentPage = page;
        this.getProducts();
    }
}
