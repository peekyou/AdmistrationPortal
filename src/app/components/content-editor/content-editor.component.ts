import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DeleteModal } from '../../core/shared/modals/delete.modal';
import { MerchantDesign } from '../../core/models/merchantDesign';
import { guid } from '../../core/helpers/utils';
import { ComponentCanDeactivate } from '../../guards/pending-changes.guard';
import { Page, CallOption, WeekDay } from './page';
import { ContentEditorService } from './content-editor.service';
import { PageNotifierService } from './page-notifier.service';

@Component({
    templateUrl: './content-editor.component.html',
    styleUrls: ['./content-editor.component.scss'],
    providers: [PageNotifierService]
})
export class ContentEditorComponent implements OnInit, ComponentCanDeactivate  {
    loading = false;
    scrollOffset: string = "0px";
    ckeditorConfig: object;
    design: MerchantDesign;
    locationPage: Page;
    contactPage: Page;
    pages: Page[];
    customPages: Page[];
    weekDays: WeekDay[];
    oldSelectedPage: Page;
    savePageSubscription: Subscription;
    saveDesignSubscription: Subscription;
    totalFileSize: number = 0;
    error: boolean = null;
    
    @ViewChild("mobile", { read: ElementRef })
    public mobileElementRef: ElementRef;
    
    @ViewChild("container")
    public containerElementRef: ElementRef;

    @HostListener("window:scroll", [])
    onWindowScroll() {
        let n = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;        
        var mobileHeight = this.mobileElementRef.nativeElement.offsetHeight;
        var containerHeight = this.containerElementRef.nativeElement.offsetHeight;
        
        // Get availabe space on screen (50px = header height approx)
        var screnHeight = window.screen.height - 50;
        var offset = n - (mobileHeight - screnHeight);
        
        if (n + screnHeight > containerHeight) {
            return;
        }
        else if (offset > 0) {
            this.scrollOffset = offset + "px";
        }
        else {
            this.scrollOffset = '0px';
        }
        console.log(n);
        console.log(containerHeight);
    }

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
        private fb: FormBuilder,
        private service: ContentEditorService, 
        private notifier: PageNotifierService,
        private modalService: NgbModal
    ) {
        // notifier.onEditSource.subscribe(page => this.editContent(page));
        // notifier.onCreateSource.subscribe(parent => this.createPage(parent));

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
            .getDesign()
            .subscribe(
                res => this.design = res,
                err => { console.log(err); }
        );

        this.service
            .getFilesSize()
            .subscribe(
                res => this.totalFileSize = res,
                err => { console.log(err); }
            );
    }

    getPages() {
        this.loading = true;
        this.service
            .getPages()
            .subscribe(
                pages => {
                    this.pages = pages
                    // this.homePage = pages.filter(p => p.typeId == 1)[0];
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

    saveDesign() {
        this.saveDesignSubscription = this.service
            .saveDesign(this.design)
            .subscribe(res => {    
                this.error = false;
            },
            err => { 
                this.error = true;
                console.log(err); 
            });
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
        
        // this.setPageEdition(newPage);
    }

    savePage(page: Page) {
        this.savePageSubscription = this.service
            .savePage(page)
            .subscribe(id => {    
                // this.selectedPage.id = id;
                // this.selectedPage.editing = this.error = false;
                this.oldSelectedPage = null;
                this.error = false;
            },
            err => { 
                this.error = true;
                console.log(err); 
            });
    }

    // cancelPageEdition() {
    //     this.selectedPage.editing = false;
    //     if (this.oldSelectedPage) {
    //         this.selectedPage.content = this.oldSelectedPage.content;
    //         this.selectedPage.title = this.oldSelectedPage.title;
    //     }
    // }

    deletePage(page: Page) {
        if (page && page.id) {
            this.service
                .deletePage(page)
                .subscribe(
                    r => {
                        this.deleteFromPages(this.customPages, page);
                    },
                    err => { console.log(err); }
                );
        }
        else if (page) {
            this.deleteFromPages(this.customPages, page);
        }
    }

    deleteFromPages(pages: Page[], page: Page) {
        for (let i = 0; pages && i < pages.length; i++) {
            if (pages[i].id === page.id) {
                pages.splice(i, 1);
                break;
            }
            this.deleteFromPages(pages[i].children, page);
        }
    }

    addPageFile = (file, page: Page) => {
        if (!page.pictures) {
            page.pictures = [];
        }
        this.service
            .uploadFile(file, page.id)
            .subscribe(
                r => {
                    file.id = r;
                    page.pictures.push(file);
                },
                err => { console.log(err); }
            );
    }

    deleteFile(file, page: Page) {
        this.service
            .deleteFile(file)
            .subscribe(
                r => {
                    console.log(page.pictures);
                    //this.selectedPage.pictures.push(file);
                },
                err => { console.log(err); }
            );
    }

    onChange(event) {
        //console.log(event);
    }

    openDeleteModal(page: Page) {
        const modalRef = this.modalService.open(DeleteModal);
        modalRef.componentInstance.data = page.title;

        modalRef.result.then((result) => {
            if (result === 'Y') {
                this.deletePage(page);
            }
        }, (reason) => { });
    }

    onTimeChange(timeInfo: any, page: Page) {
        if (!page.timeTable || page.timeTable.length === 0) {
            page.timeTable = [];
            this.weekDays.forEach(w => {
                page.timeTable.push({ day: w.id });
            });
        }

        var day = page.timeTable.filter(d => { return d.day == timeInfo.dayId });
        if (day.length > 0) {
            if (timeInfo.type == 'morning') {
                day[0].morningTime = timeInfo.time;
            }
            else {
                day[0].afternoonTime = timeInfo.time;
            }
        }
    }
}