import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Page, CallOption, WeekDay } from './page';
import { ContentEditorService } from './content-editor.service';
import { PageNotifierService } from './page-notifier.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { TranslationService } from '../../core/services/translation.service';
import { DeleteModal } from '../../core/shared/modals/delete.modal';
import { guid } from '../../core/helpers/utils';
import { ComponentCanDeactivate } from '../../guards/pending-changes.guard';

@Component({
    selector: 'content-editor',
    templateUrl: './content-editor.component.html',
    styleUrls: ['./content-editor.component.scss'],
    providers: [PageNotifierService]
})
export class ContentEditorComponent implements OnInit, ComponentCanDeactivate  {
    loading = false;
    ckeditorConfig: object;
    selectedPage: Page;
    homePage: Page;
    locationPage: Page;
    contactPage: Page;
    pages: Page[];
    customPages: Page[];
    callOptions: CallOption[];
    weekDays: WeekDay[];
    oldSelectedPage: Page;
    savePageSubscription: Subscription;
    totalFileSize: number = 0;

    // Alerts
    alertType = 'success';
    alertSuccessMessage: string;
    alertErrorMessage: string;
    alertMessage: string;
    private _serverStatus = new Subject<string>();

    // @HostListener allows us to also guard against browser refresh, close, etc.
    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        var canDeactivate = true;
        // for (var i = 0; this.pages && i < this.pages.length && canDeactivate; i++) {
        //     canDeactivate = !this.pages[i].editing;
        // }
        return canDeactivate;
    }

    constructor(
        private service: ContentEditorService, 
        private notifier: PageNotifierService,
        private modalService: NgbModal,
        private translation: TranslationService
    ) {
        notifier.onEditSource.subscribe(page => this.editContent(page));
        notifier.onCreateSource.subscribe(parent => this.createPage(parent));

        this.ckeditorConfig = {
            enterMode: 2, //CKEDITOR.ENTER_BR
            toolbar: [
                //{ name: 'document', items: ['Source', '-', 'Templates'] },
                { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
                
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
                {
                    name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-',
                        '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
                },
                { name: 'styles', items: ['Font', 'FontSize'] },
                { name: 'colors', items: ['TextColor', 'BGColor'] },
                { name: 'tools', items: [ 'About'] }
            ]
        };
    }
    
    public ngOnInit() {
        this.getPages();

        this.service
            .getCallOptions()
            .subscribe(
                res => this.callOptions = res,
                err => { console.log(err); }
        );

        this.translation.getMultiple(['CONTENT.SAVE_PAGE_SUCCESS', 'COMMON.SERVER_ERROR'], x => {
            this.alertSuccessMessage = x['CONTENT.SAVE_PAGE_SUCCESS'];
            this.alertErrorMessage = x['COMMON.SERVER_ERROR'];
        });

        this.service
            .getFilesSize()
            .subscribe(
                res => this.totalFileSize = res,
                err => { console.log(err); }
            );

        this._serverStatus.subscribe((message) => this.alertMessage = message);
        debounceTime.call(this._serverStatus, 5000).subscribe(() => this.alertMessage = null);
    }

    getPages() {
        this.loading = true;
        this.service
            .getPages()
            .subscribe(
                pages => {
                    this.pages = pages
                    this.homePage = pages.filter(p => p.typeId == 1)[0];
                    this.locationPage = pages.filter(p => p.typeId == 2)[0];
                    this.contactPage = pages.filter(p => p.typeId == 3)[0];
                    this.customPages = pages.filter(p => p.typeId == 4);
                    this.initWeekDays(this.contactPage);
                    if (!this.locationPage.address) {
                        this.locationPage.address = {};
                    }
                    this.loading = false;
                },
                err => { console.log(err); }
            );
    }

    initWeekDays(page: Page) {
        this.service
            .getWeekDays()
            .subscribe(
            res => {
                this.weekDays = res;
                if (!page.timeTable) {
                    page.timeTable = [];
                }

                if (page.timeTable.length === 0) {
                    this.weekDays.forEach(w => {
                        page.timeTable.push({ day: w.id });
                    });
                }
            },
            err => { console.log(err); }
            );
    }

    selectPage(page: Page) {
        if (this.selectedPage) {
            this.selectedPage.selected = false;
        }

        this.selectedPage = page;
        this.selectedPage.selected = true;
    }
    
    editContent(page: Page) {
        this.oldSelectedPage = Object.assign({}, page);
        this.setPageEdition(page);
    }

    orderChanged(page: Page, index: number) {
        this.customPages.forEach((p: Page, i: number) => p.order = i + 1);
    }

    createPage(parentPage: Page) {
        this.oldSelectedPage = null;
        var newPage: Page = {
            typeId: parentPage ? 5 : 4,
            title: 'New page',
            editable: true,
            draggable: true,
            expandable: true
        };

        if (parentPage) {
            if (!parentPage.children) {
                parentPage.children = [];
            }
            newPage.order = parentPage.children.length + 1;
            newPage.parentId = parentPage.id;
            parentPage.children.push(newPage);
        }
        else {
            newPage.order = this.customPages.length + 1;
            this.pages.push(newPage);
            this.customPages.push(newPage);
        }
        
        this.setPageEdition(newPage);
    }

    savePage() {
        this.savePageSubscription = this.service
            .savePage(this.selectedPage)
            .subscribe(id => {
                this.alertType = 'success';
                this._serverStatus.next(this.alertSuccessMessage);                
                this.selectedPage.id = id;
                this.selectedPage.editing = false;
                this.oldSelectedPage = null;
            },
            err => { 
                this.alertType = 'danger';
                this._serverStatus.next(this.alertErrorMessage);
                console.log(err); 
            });
    }

    cancelPageEdition() {
        this.selectedPage.editing = false;
        if (this.oldSelectedPage) {
            this.selectedPage.content = this.oldSelectedPage.content;
            this.selectedPage.title = this.oldSelectedPage.title;
        }
    }

    deletePage() {
        if (this.selectedPage && this.selectedPage.id) {
            this.service
                .deletePage(this.selectedPage)
                .subscribe(
                    r => {
                        this.deleteFromPages(this.customPages);
                        this.selectedPage = null;
                    },
                    err => { console.log(err); }
                );
        }
        else if (this.selectedPage) {
            this.deleteFromPages(this.customPages);
            this.selectedPage = null;
        }
    }

    deleteFromPages(pages: Page[]) {
        for (let i = 0; pages && i < pages.length; i++) {
            if (pages[i].id === this.selectedPage.id) {
                pages.splice(i, 1);
                break;
            }
            this.deleteFromPages(pages[i].children);
        }
    }

    addFile = (file) => {
        if (!this.selectedPage.pictures) {
            this.selectedPage.pictures = [];
        }
        this.service
            .uploadFile(file, this.selectedPage.id)
            .subscribe(
                r => {
                    file.id = r;
                    this.selectedPage.pictures.push(file);
                },
                err => { console.log(err); }
            );
    }

    deleteFile(file) {
        this.service
            .deleteFile(file)
            .subscribe(
                r => {
                    console.log(this.selectedPage.pictures);
                    //this.selectedPage.pictures.push(file);
                },
                err => { console.log(err); }
            );
    }

    onChange(event) {
        //console.log(event);
    }

    openDeleteModal() {
        const modalRef = this.modalService.open(DeleteModal);
        modalRef.componentInstance.data = this.selectedPage.title;

        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.deletePage();
            }
        }, (reason) => { });
    }

    onTimeChange(timeInfo: any) {
        if (!this.selectedPage.timeTable || this.selectedPage.timeTable.length === 0) {
            this.selectedPage.timeTable = [];
            this.weekDays.forEach(w => {
                this.selectedPage.timeTable.push({ day: w.id });
            });
        }

        var day = this.selectedPage.timeTable.filter(d => { return d.day == timeInfo.dayId });
        if (day.length > 0) {
            if (timeInfo.type == 'morning') {
                day[0].morningTime = timeInfo.time;
            }
            else {
                day[0].afternoonTime = timeInfo.time;
            }
        }
    }

    private setPageEdition(page: Page) {
        this.selectPage(page);
        this.selectedPage.editing = true;
    }
}